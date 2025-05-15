=== utils/cooldownManager.js ===
```javascript
const fs = require('fs');
const path = require('path');
const { AppError } = require('./errorHandling');
const { logger } = require('./logger');

const historyPath = path.join(__dirname, '../data/published/history.json');

function isOnCooldown(platform) {
  if (!platform) {
    const error = new AppError(400, "Platform is required to check cooldown.");
    logger.error({message: "Platform is missing", error: error});
    throw error;
  }
  const history = fs.existsSync(historyPath) ? JSON.parse(fs.readFileSync(historyPath)) : [];
  const last = history.filter(h => h.platform === platform).pop();
  if (!last) return false;
  const elapsed = Date.now() - new Date(last.time);
  const cooldownMinutes = getCooldownForPlatform(platform);
  const isOnCooldown = elapsed < cooldownMinutes * 60 * 1000;
  logger.info({ message: 'Checking cooldown', platform: platform, isOnCooldown: isOnCooldown, elapsed: elapsed, cooldown: cooldownMinutes * 60 * 1000 });
  return isOnCooldown;
}

function getCooldownForPlatform(platform) {
    const rules = {
    "instagram": { "cooldownMinutes": 60 },
    "tiktok": { "cooldownMinutes": 30 }
    };
    if (!rules[platform])
    {
        const error = new AppError(400, `Platform ${platform} is not supported.`);
        logger.error({message: "Unsupported platform", error: error, platform: platform});
        throw error;
    }
  return rules[platform].cooldownMinutes;
}


module.exports = { isOnCooldown, getCooldownForPlatform };
