const {
  createConversationSchema,
  sendMessageSchema,
  markNotificationsSchema,
} = require("../validators/messaging.validators");
const messagingService = require("../services/messaging.service");

const createConversation = async (req, res, next) => {
  try {
    const { value, error } = createConversationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const conversation = await messagingService.createConversation({
      requesterId: req.user.id,
      participantId: value.participantId,
    });

    return res.status(201).json({ conversation });
  } catch (err) {
    return next(err);
  }
};

const listConversations = async (req, res, next) => {
  try {
    const conversations = await messagingService.listConversations(req.user.id);
    return res.json({ conversations });
  } catch (err) {
    return next(err);
  }
};

const listMessages = async (req, res, next) => {
  try {
    const messages = await messagingService.listMessages({
      conversationId: req.params.id,
      requesterId: req.user.id,
    });

    return res.json({ messages });
  } catch (err) {
    return next(err);
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { value, error } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const message = await messagingService.sendMessage({
      conversationId: req.params.id,
      senderId: req.user.id,
      body: value.body,
    });

    return res.status(201).json({ message });
  } catch (err) {
    return next(err);
  }
};

const listNotifications = async (req, res, next) => {
  try {
    const notifications = await messagingService.listNotifications(req.user.id);
    return res.json({ notifications });
  } catch (err) {
    return next(err);
  }
};

const markNotifications = async (req, res, next) => {
  try {
    const { value, error } = markNotificationsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    await messagingService.markNotificationsRead({
      userId: req.user.id,
      ids: value.ids,
      markAll: value.markAll,
    });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
  listNotifications,
  markNotifications,
};
