const Joi = require("joi");

const searchProvidersSchema = Joi.object({
  q: Joi.string().allow(""),
  skills: Joi.string().allow(""),
  lat: Joi.number().min(-90).max(90),
  lng: Joi.number().min(-180).max(180),
  radiusKm: Joi.number().min(1).max(200),
  priceMin: Joi.number().min(0),
  priceMax: Joi.number().min(0),
  ratingMin: Joi.number().min(0).max(5),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(50).default(20),
}).unknown(false);

module.exports = { searchProvidersSchema };
