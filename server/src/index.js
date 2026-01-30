require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDb } = require("./config/db");
const { initSocket } = require("./socket");
require("./jobs/notification.processor");
require("./jobs/analytics.processor");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb();
    const server = http.createServer(app);
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
