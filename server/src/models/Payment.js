const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
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
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "held", "released", "failed"],
      default: "pending",
    },
    paymentIntentId: { type: String, trim: true },
    transferId: { type: String, trim: true },
  },
  { timestamps: true }
);

paymentSchema.index({ bookingId: 1 }, { unique: true });
paymentSchema.index({ customerId: 1, status: 1 });
paymentSchema.index({ providerId: 1, status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
