const mongoose = require("mongoose");
const reviewRepository = require("../repositories/review.repository");
const bookingRepository = require("../repositories/booking.repository");
const providerProfileRepository = require("../repositories/providerProfile.repository");

const createReview = async ({ bookingId, rating, comment, requesterId }) => {
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

  if (!['completed', 'paid'].includes(booking.status)) {
    const err = new Error("Booking must be completed before review");
    err.statusCode = 409;
    throw err;
  }

  const existing = await reviewRepository.findReviewByBooking(bookingId);
  if (existing) {
    const err = new Error("Review already exists for this booking");
    err.statusCode = 409;
    throw err;
  }

  const review = await reviewRepository.createReview({
    bookingId: booking._id,
    providerId: booking.providerId,
    customerId: booking.customerId,
    rating,
    comment,
  });

  const profile = await providerProfileRepository.findProviderProfileByUserId(
    booking.providerId
  );

  if (profile) {
    const newCount = profile.ratingCount + 1;
    const newAvg =
      (profile.ratingAvg * profile.ratingCount + rating) / newCount;
    profile.ratingCount = newCount;
    profile.ratingAvg = Number(newAvg.toFixed(2));
    await profile.save();
  }

  return review;
};

const listReviews = async (providerId) =>
  reviewRepository.listReviewsByProvider(providerId);

module.exports = { createReview, listReviews };
