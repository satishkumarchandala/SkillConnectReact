const express = require("express");
const {
  listSlots,
  listPublicSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../../controllers/availability.controller");
const { requireAuth, requireRole } = require("../../middlewares/auth");

const router = express.Router();

router.get(
  "/providers/:providerId/availability",
  requireAuth,
  requireRole("provider"),
  listSlots
);
router.get("/providers/:providerId/availability/public", listPublicSlots);
router.post(
  "/providers/:providerId/availability",
  requireAuth,
  requireRole("provider"),
  createSlot
);
router.patch(
  "/providers/:providerId/availability/:slotId",
  requireAuth,
  requireRole("provider"),
  updateSlot
);
router.delete(
  "/providers/:providerId/availability/:slotId",
  requireAuth,
  requireRole("provider"),
  deleteSlot
);

module.exports = router;
