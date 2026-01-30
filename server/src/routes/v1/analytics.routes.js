const express = require("express");
const {
  getProviderAnalytics,
  refreshProviderAnalytics,
} = require("../../controllers/analytics.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/analytics/overview", requireAuth, getProviderAnalytics);
router.post("/analytics/refresh", requireAuth, refreshProviderAnalytics);

module.exports = router;
