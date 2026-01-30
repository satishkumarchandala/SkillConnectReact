const { Worker } = require("bullmq");
const { getRedisConnection } = require("../config/redis");
const { getMailer } = require("../config/mail");

const connection = getRedisConnection();

let notificationWorker = null;

if (connection) {
  notificationWorker = new Worker(
    "notifications",
    async (job) => {
      const mailer = getMailer();
      if (!mailer) return;

      const { to, subject, text } = job.data;
      await mailer.sendMail({
        from: process.env.SMTP_FROM || "no-reply@skillconnect.com",
        to,
        subject,
        text,
      });
    },
    { connection }
  );
}

module.exports = { notificationWorker };
