const Conversation = require("../models/Conversation");

const createConversation = (payload) => Conversation.create(payload);

const listConversationsByUser = (userId) =>
  Conversation.find({ participantIds: userId }).sort({ lastMessageAt: -1 });

const findConversationById = (id) => Conversation.findById(id);

const findConversationByParticipants = (participantIds) =>
  Conversation.findOne({
    participantIds: { $all: participantIds, $size: participantIds.length },
  });

const updateConversationLastMessage = (id, { body, at }) =>
  Conversation.findByIdAndUpdate(
    id,
    { $set: { lastMessage: body, lastMessageAt: at } },
    { new: true }
  );

module.exports = {
  createConversation,
  listConversationsByUser,
  findConversationById,
  findConversationByParticipants,
  updateConversationLastMessage,
};
