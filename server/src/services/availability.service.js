const availabilityRepository = require("../repositories/availabilitySlot.repository");

const listSlots = async (providerId, requester) => {
  if (requester.role !== "provider" || requester.id !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return availabilityRepository.listSlotsByProvider(providerId);
};

const listPublicSlots = async (providerId) => {
  const slots = await availabilityRepository.listSlotsByProvider(providerId);
  return slots.filter((slot) => !slot.isBooked);
};

const createSlot = async ({ providerId, startAt, endAt }, requester) => {
  if (requester.role !== "provider" || requester.id !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (new Date(startAt) >= new Date(endAt)) {
    const err = new Error("Invalid time range");
    err.statusCode = 400;
    throw err;
  }

  const overlap = await availabilityRepository.findOverlappingSlot({
    providerId,
    startAt: new Date(startAt),
    endAt: new Date(endAt),
  });

  if (overlap) {
    const err = new Error("Slot overlaps existing availability");
    err.statusCode = 409;
    throw err;
  }

  return availabilityRepository.createSlot({
    providerId,
    startAt,
    endAt,
  });
};

const updateSlot = async ({ slotId, providerId, payload }, requester) => {
  if (requester.role !== "provider" || requester.id !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const slot = await availabilityRepository.findSlotById(slotId);
  if (!slot) {
    const err = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }

  if (slot.providerId.toString() !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  if (payload.startAt && payload.endAt && new Date(payload.startAt) >= new Date(payload.endAt)) {
    const err = new Error("Invalid time range");
    err.statusCode = 400;
    throw err;
  }

  return availabilityRepository.updateSlot(slotId, payload);
};

const deleteSlot = async ({ slotId, providerId }, requester) => {
  if (requester.role !== "provider" || requester.id !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  const slot = await availabilityRepository.findSlotById(slotId);
  if (!slot) {
    const err = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }

  if (slot.providerId.toString() !== providerId) {
    const err = new Error("Forbidden");
    err.statusCode = 403;
    throw err;
  }

  return availabilityRepository.deleteSlot(slotId);
};

module.exports = {
  listSlots,
  listPublicSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
