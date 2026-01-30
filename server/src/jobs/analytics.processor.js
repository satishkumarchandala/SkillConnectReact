const { Worker } = require("bullmq");
const { getRedisConnection } = require("../config/redis");
const analyticsService = require("../services/analytics.service");

const connection = getRedisConnection();

let analyticsWorker = null;

if (connection) {
  analyticsWorker = new Worker(
    "analytics",
    async (job) => {
      const { providerId } = job.data;
      if (!providerId) return;
      await analyticsService.computeAnalytics(providerId);
    },
    { connection }
  );
}

module.exports = { analyticsWorker };
