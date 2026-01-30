const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: { type: String, trim: true, required: true },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved"],
      default: "open",
    },
    resolution: { type: String, trim: true },
  },
  { timestamps: true }
);



disputeSchema.index({ status: 1, createdAt: -1 });

disputeSchema.index({ bookingId: 1 }, { unique: true });

module.exports = mongoose.model("Dispute", disputeSchema);
