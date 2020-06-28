const express = require('express');
const morgan = require('morgan');
// const { logger, stream } = require('./utils/logger');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandling = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const API_ROOT = '/api/v1';

const app = express();

app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * @description: Global Middleware
 */

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  // app.use(morgan('combined', { stream }));
  app.use(morgan('dev'));
  app.use(cors());
}

// Limit sequests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
//
/**
 * Ex: {{URL}}api/v1/tours?sort=duration&sort=-price
 * ==> error, use hpp to fix
 * whitelist is use case: {{URL}}api/v1/tours?duration=5&duration=9
 */
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'ratingsAverage',
      'ratingsqQuantity',
      'maxGroupSize',
    ],
  })
);

// Test Middleware (send time)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

/**
 * @description: Use Route API
 */

app.use(`${API_ROOT}/tours`, tourRouter);
app.use(`${API_ROOT}/users`, userRouter);
app.use(`${API_ROOT}/reviews`, reviewRouter);
app.use(`/`, viewRouter);

app.all('*', (req, res, next) => {
  const message = `Can't find *** ${req.originalUrl} *** on this server`;
  next(new AppError(404, -1, message));
});

app.use(globalErrorHandling);

module.exports = app;
