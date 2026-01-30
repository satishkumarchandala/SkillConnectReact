const express = require("express");
const {
  createBooking,
  getBooking,
  listBookings,
  confirmBooking,
  completeBooking,
  payBooking,
} = require("../../controllers/booking.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.post("/bookings", requireAuth, createBooking);
router.get("/bookings", requireAuth, listBookings);
router.get("/bookings/:id", requireAuth, getBooking);
router.patch("/bookings/:id/confirm", requireAuth, confirmBooking);
router.patch("/bookings/:id/complete", requireAuth, completeBooking);
router.patch("/bookings/:id/pay", requireAuth, payBooking);

module.exports = router;
