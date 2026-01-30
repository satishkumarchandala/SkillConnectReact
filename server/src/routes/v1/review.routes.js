const express = require("express");
const {
  createReview,
  listReviewsByProvider,
  createDispute,
  listDisputes,
  resolveDispute,
} = require("../../controllers/review.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.post("/reviews", requireAuth, requireRole("customer"), createReview);
router.get("/providers/:providerId/reviews", listReviewsByProvider);

router.post("/disputes", requireAuth, createDispute);
router.get("/disputes", requireAuth, requireRole("admin"), listDisputes);
router.patch(
  "/disputes/:id/resolve",
  requireAuth,
  requireRole("admin"),
  resolveDispute
);

module.exports = router;
