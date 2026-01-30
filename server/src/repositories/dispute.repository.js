const Dispute = require("../models/Dispute");

const createDispute = (payload) => Dispute.create(payload);
const findDisputeByBooking = (bookingId) => Dispute.findOne({ bookingId });
const listDisputes = () => Dispute.find().sort({ createdAt: -1 });
const updateDisputeStatus = (id, payload) =>
  Dispute.findByIdAndUpdate(id, payload, { new: true });

module.exports = {
  createDispute,
  findDisputeByBooking,
  listDisputes,
  updateDisputeStatus,
};
