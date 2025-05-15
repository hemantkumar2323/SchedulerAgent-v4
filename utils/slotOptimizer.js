=== utils/slotOptimizer.js ===
```javascript
const fs = require('fs');
const path = require('path');
const { AppError } = require('./errorHandling');
const { logger } = require('./logger');

const performancePath = path.join(__dirname, '../config/post-timing-performance.json');

function getNextSlot(platform) {
  if (!platform) {
     const error = new AppError(400, "Platform is required to get the next slot.");
    logger.error({message: "Platform is missing", error: error});
    throw error;
  }
  try {
    const perf = JSON.parse(fs.readFileSync(performancePath));
    if (!perf[platform] || !perf[platform].bestTimes) {
       const error = new AppError(500, `No best times configured for platform: ${platform}`);
       logger.error({message: "No best times configured", error: error, platform: platform, performancePath: performancePath});
      throw error;
    }
    const slots = perf[platform].bestTimes;
    const next = slots[Math.floor(Math.random() * slots.length)];
    const date = new Date();
    const [hour, minute] = next.split(':').map(n => parseInt(n));
    date.setHours(hour, minute, 0, 0);
    if (date < new Date()) date.setDate(date.getDate() + 1);
     logger.info({ message: 'Next Slot', platform: platform, nextSlot: date });
    return date.toISOString();
  } catch (error) {
    logger.error({ message: 'Error getting next slot', error: error, platform: platform });
    throw error; // Re-throw to be handled by global handler
  }
}

module.exports = { getNextSlot };
