const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const path = require('path');

const logsDirectory = path.join(__dirname, '../../logs');
fs.mkdirSync(logsDirectory, { recursive: true });

module.exports = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.File({ filename: path.join(logsDirectory, 'error.log'), level: 'error' }), new transports.File({ filename: path.join(logsDirectory, 'combined.log') })],
});
