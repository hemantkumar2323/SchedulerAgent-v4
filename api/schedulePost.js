=== api/schedulePost.js ===
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { validatePost } = require('../utils/validation');
const { getNextSlot } = require('../utils/slotOptimizer');
const { logger } = require('../utils/logger'); // Use Winston
const { AppError } = require('../utils/errorHandling');

const queuePath = path.join(__dirname, '../queue/post-queue.json');

router.post('/', (req, res) => {
  const post = req.body; // { scriptPath, platform }
  try {
    validatePost(post);
    const slot = getNextSlot(post.platform);
    const queue = fs.existsSync(queuePath) ? JSON.parse(fs.readFileSync(queuePath)) : [];
    queue.push({ ...post, scheduledAt: slot, status: 'queued' });
    fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2));
    logger.info({ message: 'Scheduled post', platform: post.platform, scheduledAt: slot });
    res.json({ success: true, scheduledAt: slot });
  } catch (err) {
    logger.error({ message: 'Error scheduling post', error: err, post: post });
    //  Removed res.status, handled by global error handler
    throw err;
  }
});

module.exports = router;
