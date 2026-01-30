const analyticsService = require("../services/analytics.service");

const getProviderAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }

    const analytics = await analyticsService.getAnalytics(req.user.id);
    return res.json({ analytics });
  } catch (err) {
    return next(err);
  }
};

const refreshProviderAnalytics = async (req, res, next) => {
  try {
    if (req.user.role !== "provider") {
      return res.status(403).json({ error: { message: "Forbidden" } });
    }

    const analytics = await analyticsService.computeAnalytics(req.user.id);
    return res.json({ analytics });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getProviderAnalytics, refreshProviderAnalytics };
