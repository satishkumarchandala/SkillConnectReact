const mongoose = require("mongoose");
const conversationRepo = require("../repositories/conversation.repository");
const messageRepo = require("../repositories/message.repository");
const notificationRepo = require("../repositories/notification.repository");
const { notificationQueue } = require("../jobs/notification.queue");
const { getIO } = require("../socket");
const { findUserById } = require("../repositories/user.repository");

const createConversation = async ({ requesterId, participantId }) => {
  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    const err = new Error("Invalid participant");
    err.statusCode = 400;
    throw err;
  }

  if (requesterId === participantId) {
    const err = new Error("Cannot create conversation with yourself");
    err.statusCode = 400;
    throw err;
  }

  const participant = await findUserById(participantId);
  if (!participant) {
    const err = new Error("Participant not found");
    err.statusCode = 404;
    throw err;
  }

  const participantIds = [requesterId, participantId].map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  const existing = await conversationRepo.findConversationByParticipants(
    participantIds
  );

  if (existing) {
    return existing;
  }

  return conversationRepo.createConversation({
    participantIds,
    lastMessageAt: new Date(),
  });
};

const listConversations = async (userId) =>
  conversationRepo.listConversationsByUser(userId);

const listMessages = async ({ conversationId, requesterId }) => {
  const conversation = await conversationRepo.findConversationById(conversationId);
  if (!conversation) {
    const err = new Error("Conversation not found");
    err.statusCode = 404;
    throw err;
  }

  const isParticipant = conversation.participantIds
    .map((id) => id.toString())
    .includes(requesterId);

  if (!isParticipant) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return messageRepo.listMessagesByConversation(conversationId);
};

const sendMessage = async ({ conversationId, senderId, body }) => {
  const conversation = await conversationRepo.findConversationById(conversationId);
  if (!conversation) {
    const err = new Error("Conversation not found");
    err.statusCode = 404;
    throw err;
  }

  const participantIds = conversation.participantIds.map((id) => id.toString());
  if (!participantIds.includes(senderId)) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const message = await messageRepo.createMessage({
    conversationId,
    senderId,
    body,
  });

  await conversationRepo.updateConversationLastMessage(conversationId, {
    body,
    at: new Date(),
  });

  const io = getIO();
  if (io) {
    participantIds.forEach((id) => io.to(`user:${id}`).emit("message:new", message));
  }

  const otherParticipants = participantIds.filter((id) => id !== senderId);
  await Promise.all(
    otherParticipants.map((userId) =>
      notificationRepo.createNotification({
        userId,
        type: "message",
        title: "New message",
        body,
        metadata: { conversationId, senderId },
      })
    )
  );

  await Promise.all(
    otherParticipants.map(async (userId) => {
      const user = await findUserById(userId);
      if (!user?.profile?.email) return null;
      return notificationQueue.add("email", {
        to: user.profile.email,
        subject: "New message on Skill Connect",
        text: body,
      });
    })
  );

  return message;
};

const listNotifications = async (userId) =>
  notificationRepo.listNotificationsByUser(userId);

const markNotificationsRead = async ({ userId, ids, markAll }) => {
  if (markAll) {
    await notificationRepo.markAllNotificationsRead(userId);
    return;
  }

  if (!ids.length) {
    const err = new Error("No notifications selected");
    err.statusCode = 400;
    throw err;
  }

  await notificationRepo.markNotificationsRead(userId, ids);
};

module.exports = {
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
  listNotifications,
  markNotificationsRead,
};
