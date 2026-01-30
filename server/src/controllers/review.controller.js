const {
  createReviewSchema,
  createDisputeSchema,
  resolveDisputeSchema,
} = require("../validators/review.validators");
const reviewService = require("../services/review.service");
const disputeService = require("../services/dispute.service");

const createReview = async (req, res, next) => {
  try {
    const { value, error } = createReviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const review = await reviewService.createReview({
      bookingId: value.bookingId,
      rating: value.rating,
      comment: value.comment,
      requesterId: req.user.id,
    });

    return res.status(201).json({ review });
  } catch (err) {
    return next(err);
  }
};

const listReviewsByProvider = async (req, res, next) => {
  try {
    const reviews = await reviewService.listReviews(req.params.providerId);
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
};

const createDispute = async (req, res, next) => {
  try {
    const { value, error } = createDisputeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const dispute = await disputeService.createDispute({
      bookingId: value.bookingId,
      reason: value.reason,
      requesterId: req.user.id,
    });

    return res.status(201).json({ dispute });
  } catch (err) {
    return next(err);
  }
};

const listDisputes = async (req, res, next) => {
  try {
    const disputes = await disputeService.listDisputes(req.user);
    return res.json({ disputes });
  } catch (err) {
    return next(err);
  }
};

const resolveDispute = async (req, res, next) => {
  try {
    const { value, error } = resolveDisputeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const { status, resolution } = value;
    const dispute = await disputeService.resolveDispute({
      disputeId: req.params.id,
      status,
      resolution,
      requester: req.user,
    });

    return res.json({ dispute });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createReview,
  listReviewsByProvider,
  createDispute,
  listDisputes,
  resolveDispute,
};
