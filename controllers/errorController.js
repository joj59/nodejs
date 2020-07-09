const AppError = require('../utils/AppError');

const handleJWTTokenExpiredError = () =>
  new AppError('Your token has expired, please login again', 401);

const handleJWTTokenError = () =>
  new AppError('Invalid token please log in again.', 404);

const handleCaseErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 404);
};

const handleDuplicateErrorDB = (error) => {
  const message = `A tour with the name ${error.keyValue.name} already exists`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (error) => {
  const message = `${error.errors.name.properties.message}`;
  return new AppError(message, 404);
};

const sendErrorDev = (error, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(error.statusCode).json({
      status: error.status,
      error,
      message: error.message,
      stack: error.stack,
    });
  }
  console.error('ERROR', error);
  return res.status(error.statusCode).render('error', {
    title: 'Something went wrong',
    msg: error.message,
  });
};

const sendErrorProd = (error, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
    console.error('ERROR', error);
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong but im not going to tell you what',
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).render('error', {
      title: 'Something went wrong',
      msg: error.message,
    });
  }

  console.error('ERROR', error);
  return res.status(error.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = error;
    err.message = error.message;
    const errorName = JSON.stringify(error.name);
    if (errorName === '"CastError"') err = handleCaseErrorDB(error);

    if (error.code === 11000) err = handleDuplicateErrorDB(error);

    if (errorName === '"ValidationError"') err = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') err = handleJWTTokenError();

    if (error.name === 'TokenExpiredError') err = handleJWTTokenExpiredError();

    sendErrorProd(err, req, res);
  }
  next();
};
