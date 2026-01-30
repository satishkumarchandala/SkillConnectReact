const mongoose = require("mongoose");
const bookingRepository = require("../repositories/booking.repository");
const availabilityRepository = require("../repositories/availabilitySlot.repository");
const providerProfileRepository = require("../repositories/providerProfile.repository");
const { analyticsQueue } = require("../jobs/analytics.queue");
const notificationService = require("./notification.service");

const createBooking = async ({ customerId, providerId, startAt, endAt, price, currency }) => {
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    const err = new Error("Invalid provider");
    err.statusCode = 400;
    throw err;
  }

  if (new Date(startAt) >= new Date(endAt)) {
    const err = new Error("Invalid time range");
    err.statusCode = 400;
    throw err;
  }

  const providerProfile = await providerProfileRepository.findProviderProfileByUserId(
    providerId
  );
  const bufferMinutes = providerProfile?.bufferMinutes || 0;

  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  const bufferStart = new Date(startDate.getTime() - bufferMinutes * 60000);
  const bufferEnd = new Date(endDate.getTime() + bufferMinutes * 60000);

  const overlap = await availabilityRepository.findOverlappingSlot({
    providerId,
    startAt: bufferStart,
    endAt: bufferEnd,
  });

  if (!overlap || overlap.isBooked) {
    const err = new Error("Requested time is not available");
    err.statusCode = 409;
    throw err;
  }

  const slot = await availabilityRepository.findOpenSlot({
    providerId,
    startAt: startDate,
    endAt: endDate,
  });

  if (!slot) {
    const err = new Error("Requested time is not available");
    err.statusCode = 409;
    throw err;
  }

  const booking = await bookingRepository.createBooking({
    customerId,
    providerId,
    status: "requested",
    startAt,
    endAt,
    price,
    currency,
    timeline: [{ status: "requested", at: new Date() }],
  });

  await notificationService.notifyUser({
    userId: providerId,
    type: "booking",
    title: "New booking request",
    body: "You have a new booking request.",
    metadata: { bookingId: booking._id.toString() },
    emailSubject: "New booking request",
    emailText: "You have a new booking request on Skill Connect.",
  });

  return { booking, slotId: slot._id };
};

const getBooking = async (bookingId, user) => {
  const booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) {
    const err = new Error("Booking not found");
    err.statusCode = 404;
    throw err;
  }

  const userId = user.id;
  const isOwner = booking.customerId.toString() === userId;
  const isProvider = booking.providerId.toString() === userId;

  if (!isOwner && !isProvider && user.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return booking;
};

const listBookings = async (user) => {
  return bookingRepository.listBookingsByUser({ userId: user.id, role: user.role });
};

const confirmBooking = async (bookingId, user) => {
  const booking = await getBooking(bookingId, user);

  if (user.role !== "provider" || booking.providerId.toString() !== user.id) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (booking.status !== "requested") {
    const err = new Error("Booking is not in requested state");
    err.statusCode = 409;
    throw err;
  }

  const updated = await bookingRepository.updateBookingStatus(bookingId, "confirmed");
  await analyticsQueue.add("refresh", { providerId: booking.providerId.toString() });
  await notificationService.notifyUser({
    userId: booking.customerId.toString(),
    type: "booking",
    title: "Booking confirmed",
    body: "Your booking has been confirmed.",
    metadata: { bookingId },
    emailSubject: "Booking confirmed",
    emailText: "Your booking has been confirmed on Skill Connect.",
  });
  return updated;
};

const completeBooking = async (bookingId, user) => {
  const booking = await getBooking(bookingId, user);

  if (user.role !== "provider" || booking.providerId.toString() !== user.id) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (booking.status !== "confirmed") {
    const err = new Error("Booking is not in confirmed state");
    err.statusCode = 409;
    throw err;
  }

  const updated = await bookingRepository.updateBookingStatus(bookingId, "completed");
  await analyticsQueue.add("refresh", { providerId: booking.providerId.toString() });
  await notificationService.notifyUser({
    userId: booking.customerId.toString(),
    type: "booking",
    title: "Booking completed",
    body: "Your booking has been marked as completed.",
    metadata: { bookingId },
    emailSubject: "Booking completed",
    emailText: "Your booking has been completed on Skill Connect.",
  });
  return updated;
};

const payBooking = async (bookingId, user) => {
  const booking = await getBooking(bookingId, user);

  if (user.role !== "customer" || booking.customerId.toString() !== user.id) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (booking.status !== "completed") {
    const err = new Error("Booking is not in completed state");
    err.statusCode = 409;
    throw err;
  }

  const updated = await bookingRepository.updateBookingStatus(bookingId, "paid");
  await analyticsQueue.add("refresh", { providerId: booking.providerId.toString() });
  await notificationService.notifyUser({
    userId: booking.providerId.toString(),
    type: "payment",
    title: "Payment released",
    body: "Payment has been released for your booking.",
    metadata: { bookingId },
    emailSubject: "Payment released",
    emailText: "Payment has been released for your booking on Skill Connect.",
  });
  return updated;
};

const lockAvailabilitySlot = async (slotId) => {
  return availabilityRepository.markSlotBooked(slotId);
};

module.exports = {
  createBooking,
  getBooking,
  listBookings,
  confirmBooking,
  completeBooking,
  payBooking,
  lockAvailabilitySlot,
};
