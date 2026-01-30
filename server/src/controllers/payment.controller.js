const {
  createPaymentIntentSchema,
  releaseEscrowSchema,
} = require("../validators/payment.validators");
const paymentService = require("../services/payment.service");

const createPaymentIntent = async (req, res, next) => {
  try {
    const { value, error } = createPaymentIntentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const payment = await paymentService.createPaymentIntent({
      bookingId: value.bookingId,
      requesterId: req.user.id,
    });

    return res.status(201).json({ payment });
  } catch (err) {
    return next(err);
  }
};

const releaseEscrow = async (req, res, next) => {
  try {
    const { value, error } = releaseEscrowSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: { message: error.message } });
    }

    const payment = await paymentService.releaseEscrow({
      bookingId: value.bookingId,
      requesterId: req.user.id,
    });

    return res.json({ payment });
  } catch (err) {
    return next(err);
  }
};

module.exports = { createPaymentIntent, releaseEscrow };
