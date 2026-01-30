const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

availabilitySlotSchema.index({ providerId: 1, startAt: 1, endAt: 1 });
availabilitySlotSchema.index({ providerId: 1, isBooked: 1, startAt: 1 });

module.exports = mongoose.model("AvailabilitySlot", availabilitySlotSchema);
