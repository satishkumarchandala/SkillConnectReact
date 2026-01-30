const { updateProfileSchema } = require("../validators/user.validators");
const { findUserById } = require("../repositories/user.repository");

const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    return res.json({
      user: {
        id: user._id,
        role: user.role,
        profile: user.profile,
        location: user.location,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { value, error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    if (value.name) user.profile.name = value.name;
    if (value.phone !== undefined) user.profile.phone = value.phone;
    if (value.avatar !== undefined) user.profile.avatar = value.avatar;
    if (value.locationName !== undefined) {
      user.profile.locationName = value.locationName;
    }

    if (value.location) {
      user.location = {
        type: "Point",
        coordinates: [value.location.lng, value.location.lat],
      };
    }

    await user.save();

    return res.json({
      user: {
        id: user._id,
        role: user.role,
        profile: user.profile,
        location: user.location,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getMe, updateMe };
