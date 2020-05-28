class AppError extends Error {
  constructor(statusCode, errorCode, message) {
    super();
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.message = message;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
