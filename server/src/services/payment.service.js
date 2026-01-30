const mongoose = require("mongoose");
const { getStripeClient } = require("../config/stripe");
const bookingRepository = require("../repositories/booking.repository");
const paymentRepository = require("../repositories/payment.repository");
const { analyticsQueue } = require("../jobs/analytics.queue");
const notificationService = require("./notification.service");

const createPaymentIntent = async ({ bookingId, requesterId }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const err = new Error("Invalid booking");
    err.statusCode = 400;
    throw err;
  }

  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  if (booking.customerId.toString() !== requesterId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (booking.status !== "confirmed") {
    const err = new Error("Booking must be confirmed before payment");
    err.statusCode = 409;
    throw err;
  }

  const existing = await paymentRepository.findPaymentByBooking(bookingId);
  if (existing) {
    return existing;
  }

  const stripe = getStripeClient();
  let paymentIntentId = "mock_intent";

  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(booking.price * 100),
      currency: booking.currency.toLowerCase(),
      capture_method: "manual",
      metadata: { bookingId: booking._id.toString() },
    });
    paymentIntentId = intent.id;
  }

  const payment = await paymentRepository.createPayment({
    bookingId: booking._id,
    customerId: booking.customerId,
    providerId: booking.providerId,
    amount: booking.price,
    currency: booking.currency,
    status: stripe ? "held" : "pending",
    paymentIntentId,
  });

  await notificationService.notifyUser({
    userId: booking.customerId.toString(),
    type: "payment",
    title: "Payment authorized",
    body: "Your payment authorization is complete.",
    metadata: { bookingId: booking._id.toString() },
  });

  return payment;
};

const releaseEscrow = async ({ bookingId, requesterId }) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const err = new Error("Invalid booking");
    err.statusCode = 400;
    throw err;
  }

  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  if (booking.providerId.toString() !== requesterId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (booking.status !== "completed") {
    const err = new Error("Booking must be completed before release");
    err.statusCode = 409;
    throw err;
  }

  const payment = await paymentRepository.findPaymentByBooking(bookingId);
  if (!payment) {
    const err = new Error("Payment record not found");
    err.statusCode = 404;
    throw err;
  }

  const stripe = getStripeClient();
  if (stripe && payment.paymentIntentId && payment.status !== "released") {
    await stripe.paymentIntents.capture(payment.paymentIntentId);
  }

  const updated = await paymentRepository.updatePayment(payment._id, {
    status: "released",
  });

  await bookingRepository.updateBookingStatus(bookingId, "paid");
  await analyticsQueue.add("refresh", { providerId: booking.providerId.toString() });

  await notificationService.notifyUsers([
    {
      userId: booking.customerId.toString(),
      type: "payment",
      title: "Payment released",
      body: "Your payment has been released to the provider.",
      metadata: { bookingId },
    },
    {
      userId: booking.providerId.toString(),
      type: "payment",
      title: "Payout released",
      body: "Your payout has been released.",
      metadata: { bookingId },
    },
  ]);

  return updated;
};

module.exports = { createPaymentIntent, releaseEscrow };
