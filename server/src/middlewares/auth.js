const { verifyToken } = require("../utils/jwt");

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: { message: "Invalid token" } });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: { message: "Forbidden" } });
  }

  return next();
};

module.exports = { requireAuth, requireRole };
