const Message = require("../models/Message");

const createMessage = (payload) => Message.create(payload);

const listMessagesByConversation = (conversationId) =>
  Message.find({ conversationId }).sort({ createdAt: 1 });

module.exports = { createMessage, listMessagesByConversation };
