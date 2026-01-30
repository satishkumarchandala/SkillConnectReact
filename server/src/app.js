const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const routes = require("./routes");
const { errorHandler } = require("./middlewares/error");
const { apiLimiter } = require("./middlewares/rateLimit");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "1mb",
    verify: (req, res, buf) => {
      if (req.originalUrl.includes("/payments/webhook")) {
        req.rawBody = buf;
      }
    },
  })
);
app.use(morgan("dev"));
app.use(apiLimiter);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
