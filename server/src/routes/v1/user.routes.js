const express = require("express");
const { getMe, updateMe } = require("../../controllers/user.controller");
const { requireAuth } = require("../../middlewares/auth");

const router = express.Router();

router.get("/users/me", requireAuth, getMe);
router.patch("/users/me", requireAuth, updateMe);

module.exports = router;
