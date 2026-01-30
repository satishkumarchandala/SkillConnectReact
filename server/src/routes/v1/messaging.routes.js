const express = require("express");
const {
  createConversation,
  listConversations,
  listMessages,
  sendMessage,
  listNotifications,
  markNotifications,
} = require("../../controllers/messaging.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.post("/conversations", requireAuth, createConversation);
router.get("/conversations", requireAuth, listConversations);
router.get("/conversations/:id/messages", requireAuth, listMessages);
router.post("/conversations/:id/messages", requireAuth, sendMessage);

router.get("/notifications", requireAuth, listNotifications);
router.post("/notifications/seen", requireAuth, markNotifications);

module.exports = router;
