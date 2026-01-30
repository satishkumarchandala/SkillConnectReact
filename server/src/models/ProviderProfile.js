const mongoose = require("mongoose");

const providerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    skills: { type: [String], default: [] },
    hourlyRate: { type: Number, default: 0 },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    serviceRadiusKm: { type: Number, default: 10 },
    bufferMinutes: { type: Number, default: 15 },
    experience: { type: Number, default: 0 },
    availability: { type: String, trim: true },
    bookings: { type: Number, default: 0 },
    bio: { type: String, trim: true },
    certifications: { type: [String], default: [] },
    serviceAreas: { type: [String], default: [] },
    packages: { type: [Object], default: [] },
    additionalCharges: { type: String, trim: true },
    gallery: { type: [String], default: [] },
    availableDates: { type: [String], default: [] },
    availableSlots: { type: Object, default: {} },
    availabilityPolicy: {
      type: String,
      enum: ["manual", "recurring"],
      default: "manual",
    },
    stripeAccountId: { type: String, trim: true },
  },
  { timestamps: true }
);

providerProfileSchema.index({ userId: 1 }, { unique: true });
providerProfileSchema.index({ skills: 1 });
providerProfileSchema.index({ hourlyRate: 1 });
providerProfileSchema.index({ ratingAvg: -1 });

module.exports = mongoose.model("ProviderProfile", providerProfileSchema);
