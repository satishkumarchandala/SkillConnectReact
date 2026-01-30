const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const { createUser, findUserByEmail } = require("../repositories/user.repository");
const { createProviderProfile } = require("../repositories/providerProfile.repository");

const register = async ({ name, email, password, role, phone }) => {
  const existing = await findUserByEmail(email);
  if (existing) {
    const err = new Error("Email already in use");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({
    role,
    profile: { name, email, phone },
    passwordHash,
  });

  if (role === "provider") {
    await createProviderProfile({ userId: user._id });
  }

  const token = signToken({ id: user._id.toString(), role: user.role });
  return {
    user: {
      id: user._id,
      role: user.role,
      profile: user.profile,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user._id.toString(), role: user.role });
  return {
    user: {
      id: user._id,
      role: user.role,
      profile: user.profile,
    },
    token,
  };
};

module.exports = { register, login };
