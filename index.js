=== index.js - SCHEDULER AGENT ===
```javascript
require('dotenv').config();
const express = require('express');
const app = express();
const { handleError } = require('./utils/errorHandling'); // Centralized error handling
require('express-async-errors');
const { logger } = require('./utils/logger'); // Use Winston

app.use(express.json());

// Routes
app.use('/api/schedulePost', require('./api/schedulePost'));
app.use('/api/publishNow', require('./api/publishNow'));

// Global error handler
app.use(handleError);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => logger.info(`SchedulerAgent listening on port ${PORT}`));
