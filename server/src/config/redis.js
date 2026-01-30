const Redis = require("ioredis");

const getRedisConnection = () => {
  if (process.env.REDIS_ENABLED === "false") {
    return null;
  }

  const url = process.env.REDIS_URL;
  if (!url) {
    return null;
  }

  const client = new Redis(url, { maxRetriesPerRequest: null, lazyConnect: true });
  client.on("error", () => undefined);
  return client;
};

module.exports = { getRedisConnection };
