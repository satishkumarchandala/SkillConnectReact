const mongoose = require("mongoose");
const disputeRepository = require("../repositories/dispute.repository");
const bookingRepository = require("../repositories/booking.repository");

const createDispute = async ({ bookingId, reason, requesterId }) => {
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

  const userId = requesterId;
  const isParticipant =
    booking.customerId.toString() === userId ||
    booking.providerId.toString() === userId;

  if (!isParticipant) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const existing = await disputeRepository.findDisputeByBooking(bookingId);
  if (existing) {
    const err = new Error("Dispute already exists for this booking");
    err.statusCode = 409;
    throw err;
  }

  return disputeRepository.createDispute({
    bookingId: booking._id,
    raisedBy: requesterId,
    reason,
  });
};

const listDisputes = async (requester) => {
  if (requester.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }
  return disputeRepository.listDisputes();
};

const resolveDispute = async ({ disputeId, status, resolution, requester }) => {
  if (requester.role !== "admin") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const allowedStatuses = ["under_review", "resolved"];
  if (!allowedStatuses.includes(status)) {
    const err = new Error("Invalid dispute status");
    err.statusCode = 400;
    throw err;
  }

  return disputeRepository.updateDisputeStatus(disputeId, {
    status,
    resolution,
  });
};

module.exports = { createDispute, listDisputes, resolveDispute };
