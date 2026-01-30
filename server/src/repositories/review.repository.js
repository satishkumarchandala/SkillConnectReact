const Review = require("../models/Review");

const createReview = (payload) => Review.create(payload);
const findReviewByBooking = (bookingId) => Review.findOne({ bookingId });
const listReviewsByProvider = (providerId) =>
  Review.find({ providerId }).sort({ createdAt: -1 });

module.exports = { createReview, findReviewByBooking, listReviewsByProvider };
