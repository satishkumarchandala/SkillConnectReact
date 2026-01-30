const AvailabilitySlot = require("../models/AvailabilitySlot");

const findOpenSlot = ({ providerId, startAt, endAt }) =>
  AvailabilitySlot.findOne({
    providerId,
    startAt,
    endAt,
    isBooked: false,
  });

const findSlotById = (slotId) => AvailabilitySlot.findById(slotId);

const listSlotsByProvider = (providerId) =>
  AvailabilitySlot.find({ providerId }).sort({ startAt: 1 });

const createSlot = (payload) => AvailabilitySlot.create(payload);

const updateSlot = (slotId, payload) =>
  AvailabilitySlot.findByIdAndUpdate(slotId, payload, { new: true });

const deleteSlot = (slotId) => AvailabilitySlot.findByIdAndDelete(slotId);

const markSlotBooked = (slotId) =>
  AvailabilitySlot.findByIdAndUpdate(
    slotId,
    { $set: { isBooked: true } },
    { new: true }
  );

const findOverlappingSlot = ({ providerId, startAt, endAt }) =>
  AvailabilitySlot.findOne({
    providerId,
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  });

module.exports = {
  findOpenSlot,
  findSlotById,
  listSlotsByProvider,
  createSlot,
  updateSlot,
  deleteSlot,
  markSlotBooked,
  findOverlappingSlot,
};
