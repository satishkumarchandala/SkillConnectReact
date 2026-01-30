const mongoose = require("mongoose");

const bookingTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "paid", "cancelled"],
      required: true,
    },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "confirmed", "completed", "paid", "cancelled"],
      default: "requested",
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    escrowPaymentId: { type: String, trim: true },
    timeline: { type: [bookingTimelineSchema], default: [] },
  },
  { timestamps: true }
);

bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ startAt: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
