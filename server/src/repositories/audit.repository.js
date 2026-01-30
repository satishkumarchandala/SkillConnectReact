const AuditLog = require("../models/AuditLog");

const createAuditLog = (payload) => AuditLog.create(payload);

module.exports = { createAuditLog };
