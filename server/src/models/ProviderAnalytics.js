const mongoose = require("mongoose");

const providerAnalyticsSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalEarnings: { type: Number, default: 0 },
    responseTimeAvgMinutes: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProviderAnalytics", providerAnalyticsSchema);
