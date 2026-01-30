const Joi = require("joi");

const createBookingSchema = Joi.object({
  providerId: Joi.string().required(),
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().length(3).default("USD"),
});

module.exports = { createBookingSchema };
