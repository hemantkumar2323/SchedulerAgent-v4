=== utils/validation.js ===
```javascript
const fs = require('fs');
const { AppError } = require('./errorHandling');
const { logger } = require('./logger');

function validatePost(post) {
  if (!post) {
    const error = new AppError(400, "Post object is required.");
    logger.error({message: "Post object is missing", error: error});
    throw error;
  }
  if (!post.scriptPath || !post.platform) {
    const error = new AppError(400, "Both scriptPath and platform are required in the post object.");
    logger.error({message: "scriptPath or platform is missing", error: error, post: post});
    throw error;
  }
  if (!fs.existsSync(post.scriptPath)) {
    const error = new AppError(400, `Script file not found at: ${post.scriptPath}`);
    logger.error({message: "Script file not found", error: error, scriptPath: post.scriptPath});
    throw error;
  }
  if (post.platform !== 'instagram' && post.platform !== 'tiktok') {
     const error = new AppError(400, `Invalid platform.  Must be 'instagram' or 'tiktok'.`);
     logger.error({message: "Invalid platform", error: error, platform: post.platform});
     throw error;
  }
}

module.exports = { validatePost };
