const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiryAt: { type: Date, required: true },
  clicks: [
    {
      timestamp: { type: Date, default: Date.now },
      referrer: String,
      geo: String,
    },
  ],
});

const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);
module.exports = ShortUrl;
