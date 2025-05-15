=== api/publishNow.js ===
```javascript
const express = require('express');
const router = express.Router();
const { publishToMeta } = require('../utils/publisherMeta');
const { publishToTikTok } = require('../utils/publisherTikTok');
const { logger } = require('../utils/logger'); // Use Winston
const { AppError } = require('../utils/errorHandling');

router.post('/', async (req, res) => {
  const { script, platform } = req.body;
  try {
    if (!script || !platform) {
      throw new AppError(400, "Script and platform are required.");
    }
    let result;
    if (platform === 'instagram') {
      result = await publishToMeta(script);
    } else if (platform === 'tiktok') {
      result = await publishToTikTok(script);
    } else {
      throw new AppError(400, `Unsupported platform: ${platform}`);
    }
    logger.info({ message: 'Published post', platform: platform, result: result });
    res.json({ success: true, result });
  } catch (err) {
    logger.error({ message: 'Error publishing post', error: err, requestBody: req.body });
    // Removed res.status, handled by global error handler
    throw err;
  }
});

module.exports = router;
