const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

// Define routes
router.post("/shorten", urlController.createShortUrl);
router.get("/stats/:shortcode", urlController.getStats);
router.get("/:shortcode", urlController.redirectUrl);

module.exports = router;
