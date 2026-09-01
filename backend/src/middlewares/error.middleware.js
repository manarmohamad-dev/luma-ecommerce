const logger = require('../utils/logger');

exports.notFound = (req, res) => res.status(404).json({ success: false, message: 'Route not found' });
exports.errorHandler = (error, req, res, next) => {
  logger.error(error);
  if (error.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid resource identifier' });
  if (error.code === 11000) return res.status(409).json({ success: false, message: 'This value already exists' });
  res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Internal server error' });
};
