const User = require("../models/User");

const createUser = (payload) => User.create(payload);
const findUserByEmail = (email) => User.findOne({ "profile.email": email });
const findUserById = (id) => User.findById(id);

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
