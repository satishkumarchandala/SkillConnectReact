const Payment = require("../models/Payment");

const createPayment = (payload) => Payment.create(payload);
const findPaymentByBooking = (bookingId) => Payment.findOne({ bookingId });
const updatePayment = (id, payload) =>
  Payment.findByIdAndUpdate(id, payload, { new: true });

module.exports = { createPayment, findPaymentByBooking, updatePayment };
