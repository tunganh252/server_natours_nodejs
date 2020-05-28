const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(400, -1, message);
};

const handleDuplicateFieldsDB = (err) => {
  /**
   * 2 options to get value duplicat fields in DB
   */
  // const value = err.errmsg.match(/"(.*?)"/);
  const value = err.keyValue.name || err.keyValue.email;
  const message = `Duplicate field value: *** ${value} ***. Please use another value!`;
  return new AppError(400, -1, message);
};

const handleValidationErrorDB = (err) => {
  const listErrors = Object.values(err.errors).map((item) => item.message);

  const message = `Invalid input data: ${listErrors.join('. ')}`;
  return new AppError(400, -1, message);
};

const handleErrorInvalidTokenJWT = () => {
  const message = 'Invalid token, please login again!';
  return new AppError(401, -1, message);
};

const handleErrorExpiredTokenJWT = () => {
  const message = 'Your token has expired, please login again!';
  return new AppError(401, -1, message);
};

// ======================================================================= //
// ======================================================================= //
// ======================================================================= //

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    Status: err.status,
    Code: err.errorCode,
    Message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      Status: err.status,
      Code: err.errorCode,
      Message: err.message,
    });
  } else {
    console.log('ERROR 🚫 ❌ 🤬', err);
    res.status(500).json({
      Status: 'error',
      Code: -99,
      Message: 'Some thing went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.errorCode = err.errorCode || -1;

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'PRODUCTION') {
    let newError = JSON.parse(JSON.stringify(err));

    switch (true) {
      case newError.name === 'CastError':
        newError = handleCastErrorDB(newError);
        break;
      case newError.code === 11000:
        newError = handleDuplicateFieldsDB(newError);
        break;
      case newError.name === 'ValidationError':
        newError = handleValidationErrorDB(newError);
        break;
      case newError.name === 'JsonWebTokenError':
        newError = handleErrorInvalidTokenJWT();
        break;
      case newError.name === 'TokenExpiredError':
        newError = handleErrorExpiredTokenJWT();
        break;

      default:
        break;
    }
    sendErrorProd(newError, res);
  }

  next();
};
