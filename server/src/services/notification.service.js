const { getIO } = require("../socket");
const notificationRepo = require("../repositories/notification.repository");
const { notificationQueue } = require("../jobs/notification.queue");
const { findUserById } = require("../repositories/user.repository");

const notifyUser = async ({
  userId,
  type,
  title,
  body,
  metadata = {},
  emailSubject,
  emailText,
}) => {
  const notification = await notificationRepo.createNotification({
    userId,
    type,
    title,
    body,
    metadata,
  });

  const io = getIO();
  if (io) {
    io.to(`user:${userId}`).emit("notification:new", notification);
  }

  if (emailSubject && emailText) {
    const user = await findUserById(userId);
    if (user?.profile?.email) {
      await notificationQueue.add("email", {
        to: user.profile.email,
        subject: emailSubject,
        text: emailText,
      });
    }
  }

  return notification;
};

const notifyUsers = async (payloads) => {
  await Promise.all(payloads.map((payload) => notifyUser(payload)));
};

module.exports = { notifyUser, notifyUsers };
