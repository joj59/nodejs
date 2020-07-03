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

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('ERROR', error);
    res.status(500).json({
      status: 'error',
      message: 'something went wrong but im not going to tell you what',
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = error;
    const errorName = JSON.stringify(error.name);
    if (errorName === '"CastError"') err = handleCaseErrorDB(error);

    if (error.code === 11000) err = handleDuplicateErrorDB(error);

    if (errorName === '"ValidationError"') err = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') err = handleJWTTokenError();

    if (error.name === 'TokenExpiredError') err = handleJWTTokenExpiredError();

    sendErrorProd(err, res);
  }
  console.log(process.env.NODE_ENV);
  next();
};
