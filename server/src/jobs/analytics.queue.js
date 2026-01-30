const { Queue } = require("bullmq");
const { getRedisConnection } = require("../config/redis");

const connection = getRedisConnection();

const analyticsQueue = connection
	? new Queue("analytics", { connection })
	: {
			add: async () => null,
		};

module.exports = { analyticsQueue };
