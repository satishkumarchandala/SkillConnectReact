const {
  createSlotSchema,
  updateSlotSchema,
} = require("../validators/availability.validators");
const availabilityService = require("../services/availability.service");

const listSlots = async (req, res, next) => {
  try {
    const slots = await availabilityService.listSlots(req.params.providerId, req.user);
    return res.json({ slots });
  } catch (err) {
    return next(err);
  }
};

const listPublicSlots = async (req, res, next) => {
  try {
    const slots = await availabilityService.listPublicSlots(req.params.providerId);
    return res.json({ slots });
  } catch (err) {
    return next(err);
  }
};

const createSlot = async (req, res, next) => {
  try {
    const { value, error } = createSlotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const slot = await availabilityService.createSlot(
      { providerId: req.params.providerId, ...value },
      req.user
    );

    return res.status(201).json({ slot });
  } catch (err) {
    return next(err);
  }
};

const updateSlot = async (req, res, next) => {
  try {
    const { value, error } = updateSlotSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const slot = await availabilityService.updateSlot(
      {
        slotId: req.params.slotId,
        providerId: req.params.providerId,
        payload: value,
      },
      req.user
    );

    return res.json({ slot });
  } catch (err) {
    return next(err);
  }
};

const deleteSlot = async (req, res, next) => {
  try {
    await availabilityService.deleteSlot(
      {
        slotId: req.params.slotId,
        providerId: req.params.providerId,
      },
      req.user
    );

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listSlots,
  listPublicSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
