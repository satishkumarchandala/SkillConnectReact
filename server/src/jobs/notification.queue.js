const { Queue } = require("bullmq");
const { getRedisConnection } = require("../config/redis");

const connection = getRedisConnection();

const notificationQueue = connection
	? new Queue("notifications", { connection })
	: {
			add: async () => null,
		};

module.exports = { notificationQueue };
