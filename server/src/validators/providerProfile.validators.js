const Joi = require("joi");

const updateProviderProfileSchema = Joi.object({
  skills: Joi.array().items(Joi.string().trim()).default([]),
  hourlyRate: Joi.number().min(0),
  serviceRadiusKm: Joi.number().min(1).max(200),
  bufferMinutes: Joi.number().min(0).max(180),
  experience: Joi.number().min(0),
  availability: Joi.string().trim().allow(""),
  bookings: Joi.number().min(0),
  bio: Joi.string().trim().max(4000).allow(""),
  certifications: Joi.array().items(Joi.string().trim()).default([]),
  serviceAreas: Joi.array().items(Joi.string().trim()).default([]),
  packages: Joi.array().items(Joi.object()).default([]),
  additionalCharges: Joi.string().trim().allow(""),
  gallery: Joi.array().items(Joi.string().trim()).default([]),
  availableDates: Joi.array().items(Joi.string().trim()).default([]),
  availableSlots: Joi.object().default({}),
  availabilityPolicy: Joi.string().valid("manual", "recurring"),
});

module.exports = { updateProviderProfileSchema };
