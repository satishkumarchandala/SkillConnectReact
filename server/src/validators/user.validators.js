const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  phone: Joi.string().trim().allow(""),
  avatar: Joi.string().uri().allow(""),
  locationName: Joi.string().trim().max(120).allow(""),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90),
    lng: Joi.number().min(-180).max(180),
  }),
});

module.exports = { updateProfileSchema };
