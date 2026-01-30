const { getStripeClient } = require("../config/stripe");

const handleWebhook = async (req, res, next) => {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(501).json({ error: { message: "Stripe not configured" } });
    }

    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(400).json({ error: { message: "Webhook signature missing" } });
    }

    const event = stripe.webhooks.constructEvent(
      req.rawBody || req.body,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case "payment_intent.succeeded":
      case "payment_intent.amount_capturable_updated":
        break;
      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    return next(err);
  }
};

module.exports = { handleWebhook };
