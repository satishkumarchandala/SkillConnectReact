const express = require("express");
const {
  createPaymentIntent,
  releaseEscrow,
} = require("../../controllers/payment.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/payments/intent",
  requireAuth,
  requireRole("customer"),
  createPaymentIntent
);

router.post(
  "/payments/escrow/release",
  requireAuth,
  requireRole("provider"),
  releaseEscrow
);

module.exports = router;
