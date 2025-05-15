=== utils/logger.js ===
```javascript
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
  format: combine(timestamp(), json()),
  transports: [
    new DailyRotateFile({ filename: 'logs/scheduler-%DATE%.log', datePattern: 'YYYY-MM-DD', maxFiles: '14d' }),
    new winston.transports.Console({ level: 'debug' })
  ]
});

module.exports = { logger };
