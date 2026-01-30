const express = require("express");
const {
  searchProviders,
  getProviderById,
} = require("../../controllers/provider.controller");

const router = express.Router();

router.get("/providers/search", searchProviders);
router.get("/providers/:id", getProviderById);

module.exports = router;
