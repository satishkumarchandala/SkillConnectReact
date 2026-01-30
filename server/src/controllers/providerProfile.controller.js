const { updateProviderProfileSchema } = require("../validators/providerProfile.validators");
const providerProfileService = require("../services/providerProfile.service");

const getMyProfile = async (req, res, next) => {
  try {
    const profile = await providerProfileService.getMyProfile(req.user);
    return res.json({ profile });
  } catch (err) {
    return next(err);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { value, error } = updateProviderProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const profile = await providerProfileService.updateMyProfile({
      user: req.user,
      payload: value,
    });

    return res.json({ profile });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getMyProfile, updateMyProfile };
