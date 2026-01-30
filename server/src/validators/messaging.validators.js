const Joi = require("joi");

const createConversationSchema = Joi.object({
  participantId: Joi.string().required(),
});

const sendMessageSchema = Joi.object({
  body: Joi.string().trim().min(1).max(2000).required(),
});

const markNotificationsSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).default([]),
  markAll: Joi.boolean().default(false),
});

module.exports = {
  createConversationSchema,
  sendMessageSchema,
  markNotificationsSchema,
};
