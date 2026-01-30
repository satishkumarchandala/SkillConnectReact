const { getRedisConnection } = require("../config/redis");

const redis = getRedisConnection();

const getCache = async (key) => {
  if (!redis) return null;
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

const setCache = async (key, value, ttlSeconds = 60) => {
  if (!redis) return;
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
};

const buildKey = (prefix, params) => {
  const serialized = JSON.stringify(params);
  return `${prefix}:${serialized}`;
};

module.exports = { getCache, setCache, buildKey };
