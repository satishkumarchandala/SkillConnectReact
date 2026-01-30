const Joi = require("joi");

const createPaymentIntentSchema = Joi.object({
  bookingId: Joi.string().required(),
});

const releaseEscrowSchema = Joi.object({
  bookingId: Joi.string().required(),
});

module.exports = { createPaymentIntentSchema, releaseEscrowSchema };
