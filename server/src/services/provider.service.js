const providerRepository = require("../repositories/provider.repository");
const { getCache, setCache, buildKey } = require("../utils/cache");

const searchProviders = async (filters) => {
  const cacheKey = buildKey("providers:search", filters);
  const cached = await getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const results = await providerRepository.searchProviders(filters);
  await setCache(cacheKey, results, Number(process.env.SEARCH_CACHE_TTL || 60));
  return results;
};

const getProviderById = async (id) => {
  const provider = await providerRepository.getProviderById(id);
  if (!provider) {
    const err = new Error("Provider not found");
    err.statusCode = 404;
    throw err;
  }
  return provider;
};

module.exports = { searchProviders, getProviderById };
