const Stripe = require("stripe");

const getStripeClient = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key, { apiVersion: "2024-04-10" });
};

module.exports = { getStripeClient };
