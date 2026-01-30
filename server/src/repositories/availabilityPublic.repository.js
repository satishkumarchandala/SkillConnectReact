const AvailabilitySlot = require("../models/AvailabilitySlot");

const findNextOpenSlotByProvider = (providerId) =>
  AvailabilitySlot.findOne({
    providerId,
    isBooked: false,
    startAt: { $gte: new Date() },
  })
    .sort({ startAt: 1 })
    .lean();

const findNextOpenSlotsByProviders = async (providerIds) => {
  const slots = await AvailabilitySlot.aggregate([
    {
      $match: {
        providerId: { $in: providerIds },
        isBooked: false,
        startAt: { $gte: new Date() },
      },
    },
    { $sort: { providerId: 1, startAt: 1 } },
    {
      $group: {
        _id: "$providerId",
        nextAvailableSlot: { $first: "$startAt" },
      },
    },
  ]);

  return slots.reduce((acc, slot) => {
    acc[slot._id.toString()] = slot.nextAvailableSlot;
    return acc;
  }, {});
};

module.exports = { findNextOpenSlotByProvider, findNextOpenSlotsByProviders };