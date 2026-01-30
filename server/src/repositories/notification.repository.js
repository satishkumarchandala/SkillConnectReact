const Notification = require("../models/Notification");

const createNotification = (payload) => Notification.create(payload);

const listNotificationsByUser = (userId) =>
  Notification.find({ userId }).sort({ createdAt: -1 });

const markNotificationsRead = (userId, ids) =>
  Notification.updateMany(
    { userId, _id: { $in: ids } },
    { $set: { isRead: true } }
  );

const markAllNotificationsRead = (userId) =>
  Notification.updateMany({ userId }, { $set: { isRead: true } });

module.exports = {
  createNotification,
  listNotificationsByUser,
  markNotificationsRead,
  markAllNotificationsRead,
};
