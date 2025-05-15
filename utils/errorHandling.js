=== utils/errorHandling.js ===
```javascript
const { logger } = require('./logger');

class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //  Indicates if this is a known, expected error
    Error.captureStackTrace(this, this.constructor); //capture
  }
}



const handleError = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: "Unhandled Application Error",
    error: err,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      headers: req.headers
    }
  });

  // Customize the error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (!(err instanceof AppError)) { //if it is not our operational error.
    statusCode = 500;
    message = "Internal Server Error"; //hide
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = { AppError, handleError };
