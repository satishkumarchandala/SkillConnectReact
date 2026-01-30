const Booking = require("../models/Booking");
const providerAnalyticsRepository = require("../repositories/providerAnalytics.repository");

const computeAnalytics = async (providerId) => {
  const bookings = await Booking.find({ providerId });

  const totalEarnings = bookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.price, 0);

  const requested = bookings.filter((b) => b.status === "requested").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const paid = bookings.filter((b) => b.status === "paid").length;

  const conversionRate =
    requested === 0 ? 0 : Number(((confirmed + completed + paid) / requested).toFixed(2));

  const responseTimes = bookings
    .filter((b) => b.status !== "requested")
    .map((b) => {
      const requestedAt = b.timeline.find((t) => t.status === "requested")?.at;
      const confirmedAt = b.timeline.find((t) => t.status === "confirmed")?.at;
      if (!requestedAt || !confirmedAt) return null;
      return (new Date(confirmedAt) - new Date(requestedAt)) / 60000;
    })
    .filter((val) => val !== null);

  const responseTimeAvgMinutes = responseTimes.length
    ? Number(
        (
          responseTimes.reduce((sum, val) => sum + val, 0) / responseTimes.length
        ).toFixed(2)
      )
    : 0;

  const payload = {
    totalEarnings,
    responseTimeAvgMinutes,
    conversionRate,
    lastUpdatedAt: new Date(),
  };

  return providerAnalyticsRepository.upsertAnalytics(providerId, payload);
};

const getAnalytics = async (providerId) =>
  providerAnalyticsRepository.getAnalyticsByProvider(providerId);

module.exports = { computeAnalytics, getAnalytics };
