const { registerSchema, loginSchema } = require("../validators/auth.validators");
const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const result = await authService.register(value);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const result = await authService.login(value);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login };
