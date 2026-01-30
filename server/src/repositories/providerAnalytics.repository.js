const ProviderAnalytics = require("../models/ProviderAnalytics");

const getAnalyticsByProvider = (providerId) =>
  ProviderAnalytics.findOne({ providerId });

const upsertAnalytics = (providerId, payload) =>
  ProviderAnalytics.findOneAndUpdate(
    { providerId },
    { $set: payload },
    { upsert: true, new: true }
  );

module.exports = { getAnalyticsByProvider, upsertAnalytics };
