const providerProfileRepository = require("../repositories/providerProfile.repository");

const getMyProfile = async (user) => {
  if (user.role !== "provider") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const profile = await providerProfileRepository.findProviderProfileByUserId(
    user.id
  );

  if (!profile) {
    const err = new Error("Provider profile not found");
    err.statusCode = 404;
    throw err;
  }

  return profile;
};

const updateMyProfile = async ({ user, payload }) => {
  if (user.role !== "provider") {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const profile = await providerProfileRepository.updateProviderProfileByUserId(
    user.id,
    payload
  );

  if (!profile) {
    const err = new Error("Provider profile not found");
    err.statusCode = 404;
    throw err;
  }

  return profile;
};

module.exports = { getMyProfile, updateMyProfile };
