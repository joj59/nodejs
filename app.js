const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xssClean());

app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find requested URL (${req.originalUrl})`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
