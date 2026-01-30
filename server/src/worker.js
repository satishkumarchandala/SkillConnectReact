require("dotenv").config();
require("./config/db").connectDb().catch(() => undefined);
require("./jobs/notification.processor");
require("./jobs/analytics.processor");

console.log("Worker started");
