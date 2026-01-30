const ProviderProfile = require("../models/ProviderProfile");

const createProviderProfile = (payload) => ProviderProfile.create(payload);
const findProviderProfileByUserId = (userId) =>
  ProviderProfile.findOne({ userId });
const updateProviderProfileByUserId = (userId, payload) =>
  ProviderProfile.findOneAndUpdate({ userId }, payload, { new: true });

module.exports = {
  createProviderProfile,
  findProviderProfileByUserId,
  updateProviderProfileByUserId,
};
