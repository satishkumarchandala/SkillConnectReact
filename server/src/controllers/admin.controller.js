const adminService = require("../services/admin.service");

const suspendProvider = async (req, res, next) => {
  try {
    const user = await adminService.suspendProvider({
      providerId: req.params.id,
      adminId: req.user.id,
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const reinstateProvider = async (req, res, next) => {
  try {
    const user = await adminService.reinstateProvider({
      providerId: req.params.id,
      adminId: req.user.id,
    });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

const removeReview = async (req, res, next) => {
  try {
    const review = await adminService.removeReview({
      reviewId: req.params.id,
      adminId: req.user.id,
    });
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  suspendProvider,
  reinstateProvider,
  removeReview,
};
