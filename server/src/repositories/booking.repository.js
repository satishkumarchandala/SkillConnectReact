const Booking = require("../models/Booking");

const createBooking = (payload) => Booking.create(payload);

const findBookingById = (id) => Booking.findById(id);

const listBookingsByUser = ({ userId, role }) => {
  if (role === "provider") {
    return Booking.find({ providerId: userId }).sort({ createdAt: -1 });
  }
  return Booking.find({ customerId: userId }).sort({ createdAt: -1 });
};

const updateBookingStatus = (id, status) =>
  Booking.findByIdAndUpdate(
    id,
    {
      $set: { status },
      $push: { timeline: { status, at: new Date() } },
    },
    { new: true }
  );

module.exports = {
  createBooking,
  findBookingById,
  listBookingsByUser,
  updateBookingStatus,
};
