const { createBookingSchema } = require("../validators/booking.validators");
const bookingService = require("../services/booking.service");

const createBooking = async (req, res, next) => {
  try {
    const { value, error } = createBookingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const { booking, slotId } = await bookingService.createBooking({
      customerId: req.user.id,
      ...value,
    });

    await bookingService.lockAvailabilitySlot(slotId);

    return res.status(201).json({ booking });
  } catch (err) {
    return next(err);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.getBooking(req.params.id, req.user);
    return res.json({ booking });
  } catch (err) {
    return next(err);
  }
};

const listBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.listBookings(req.user);
    return res.json({ bookings });
  } catch (err) {
    return next(err);
  }
};

const confirmBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.confirmBooking(req.params.id, req.user);
    return res.json({ booking });
  } catch (err) {
    return next(err);
  }
};

const completeBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.completeBooking(req.params.id, req.user);
    return res.json({ booking });
  } catch (err) {
    return next(err);
  }
};

const payBooking = async (req, res, next) => {
  try {
    const booking = await bookingService.payBooking(req.params.id, req.user);
    return res.json({ booking });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createBooking,
  getBooking,
  listBookings,
  confirmBooking,
  completeBooking,
  payBooking,
};
