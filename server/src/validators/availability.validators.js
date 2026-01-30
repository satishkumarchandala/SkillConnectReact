const Joi = require("joi");

const createSlotSchema = Joi.object({
  startAt: Joi.date().iso().required(),
  endAt: Joi.date().iso().required(),
});

const updateSlotSchema = Joi.object({
  startAt: Joi.date().iso(),
  endAt: Joi.date().iso(),
  isBooked: Joi.boolean(),
});

module.exports = { createSlotSchema, updateSlotSchema };
