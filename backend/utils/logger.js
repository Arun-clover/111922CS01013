
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
};

const getExpiryDate = (validity) => {
  const minutes = parseInt(validity, 10) || 60; 
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

module.exports = { logger, getExpiryDate };
