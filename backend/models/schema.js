const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  expiryAt: { type: Date, required: true },
  clicks: [
    {
      referrer: String,
      geo: String,
      clickedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("ShortUrl", shortUrlSchema);
