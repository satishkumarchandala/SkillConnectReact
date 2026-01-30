const express = require("express");
const { handleWebhook } = require("../../controllers/stripe.controller");

const router = express.Router();

router.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

module.exports = router;
