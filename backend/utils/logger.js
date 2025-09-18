// utils/logger.js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

// calculate expiry date from "validity" (minutes)
const getExpiryDate = (validity) => {
  const minutes = parseInt(validity, 10) || 60; // default 60 min
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

module.exports = { logger, getExpiryDate };
