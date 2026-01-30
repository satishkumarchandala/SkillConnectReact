const Joi = require("joi");

const createReviewSchema = Joi.object({
  bookingId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().trim().max(2000).allow(""),
});

const createDisputeSchema = Joi.object({
  bookingId: Joi.string().required(),
  reason: Joi.string().trim().min(10).max(4000).required(),
});

const resolveDisputeSchema = Joi.object({
  status: Joi.string().valid("under_review", "resolved").required(),
  resolution: Joi.string().trim().max(4000).allow(""),
});

module.exports = { createReviewSchema, createDisputeSchema, resolveDisputeSchema };
