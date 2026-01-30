const express = require("express");
const {
  suspendProvider,
  reinstateProvider,
  removeReview,
} = require("../../controllers/admin.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.patch(
  "/admin/providers/:id/suspend",
  requireAuth,
  requireRole("admin"),
  suspendProvider
);
router.patch(
  "/admin/providers/:id/reinstate",
  requireAuth,
  requireRole("admin"),
  reinstateProvider
);
router.patch(
  "/admin/reviews/:id/remove",
  requireAuth,
  requireRole("admin"),
  removeReview
);

module.exports = router;
