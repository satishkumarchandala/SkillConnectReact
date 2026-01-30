const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
} = require("../../controllers/providerProfile.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.get(
  "/providers/me/profile",
  requireAuth,
  requireRole("provider"),
  getMyProfile
);
router.patch(
  "/providers/me/profile",
  requireAuth,
  requireRole("provider"),
  updateMyProfile
);

module.exports = router;
