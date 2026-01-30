const express = require("express");
const v1HealthRoutes = require("./v1/health.routes");
const v1AuthRoutes = require("./v1/auth.routes");
const v1UserRoutes = require("./v1/user.routes");
const v1ProviderRoutes = require("./v1/provider.routes");
const v1BookingRoutes = require("./v1/booking.routes");
const v1AvailabilityRoutes = require("./v1/availability.routes");
const v1MessagingRoutes = require("./v1/messaging.routes");
const v1PaymentRoutes = require("./v1/payment.routes");
const v1ReviewRoutes = require("./v1/review.routes");
const v1AdminRoutes = require("./v1/admin.routes");
const v1AnalyticsRoutes = require("./v1/analytics.routes");
const v1ProviderProfileRoutes = require("./v1/providerProfile.routes");
const v1StripeRoutes = require("./v1/stripe.routes");

const router = express.Router();

router.use("/v1", v1HealthRoutes);
router.use("/v1", v1AuthRoutes);
router.use("/v1", v1UserRoutes);
router.use("/v1", v1ProviderRoutes);
router.use("/v1", v1BookingRoutes);
router.use("/v1", v1AvailabilityRoutes);
router.use("/v1", v1MessagingRoutes);
router.use("/v1", v1PaymentRoutes);
router.use("/v1", v1ReviewRoutes);
router.use("/v1", v1AdminRoutes);
router.use("/v1", v1AnalyticsRoutes);
router.use("/v1", v1ProviderProfileRoutes);
router.use("/v1", v1StripeRoutes);

module.exports = router;
