const ShortUrl = require("../models/schema.js");
const validUrl = require("valid-url");
const shortid = require("shortid");
const geoip = require("geoip-lite");
const { getExpiryDate } = require("../utils/logger.js");

// POST - Create Short URL
const createShortUrl = async (req, res) => {
  try {
    let { url, validity, shortcode } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Auto-prepend http:// if missing
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }

    if (!validUrl.isUri(url)) {
      return res.status(400).json({ error: "Invalid URL" });
    }

    let code = shortcode ? shortcode : shortid.generate();
    if (!/^[a-zA-Z0-9]+$/.test(code)) {
      return res.status(400).json({ error: "Shortcode must be alphanumeric" });
    }

    const exists = await ShortUrl.findOne({ shortCode: code });
    if (exists) {
      return res.status(400).json({ error: "Shortcode already exists" });
    }

    const expiryAt = getExpiryDate(validity);
    const newShort = new ShortUrl({
      originalUrl: url,
      shortCode: code,
      expiryAt,
    });

    await newShort.save();

    res.status(201).json({
      shortLink: `${req.protocol}://${req.get("host")}/${code}`,
      expiry: expiryAt.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// GET - Redirect
const redirectUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await ShortUrl.findOne({ shortCode: shortcode });

    if (!record) return res.status(404).json({ error: "Shortcode not found" });
    if (record.expiryAt < new Date()) {
      return res.status(410).json({ error: "Short link expired" });
    }

    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    record.clicks.push({
      referrer: req.get("Referrer") || "Direct",
      geo: geo ? geo.country : "Unknown",
    });
    await record.save();

    res.redirect(record.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// GET - Stats
const getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const record = await ShortUrl.findOne({ shortCode: shortcode });

    if (!record) return res.status(404).json({ error: "Shortcode not found" });

    res.json({
      totalClicks: record.clicks.length,
      originalUrl: record.originalUrl,
      createdAt: record.createdAt,
      expiryAt: record.expiryAt,
      clicks: record.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  createShortUrl,
  redirectUrl,
  getStats,
};
