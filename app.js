const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const { urlencoded } = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser());

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

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find requested URL (${req.originalUrl})`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
