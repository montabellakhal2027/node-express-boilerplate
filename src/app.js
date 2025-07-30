require('module-alias/register');
const config = require('./config/config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const httpStatus = require('http-status');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');
const passport = require('passport');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

// Enable if you're behind a reverse proxy (e.g., Kubernetes)
app.set('trust proxy', true);

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

// Gzip compression
app.use(compression());

// Enable cors
app.use(cors());
app.options('*', cors());

// Add API prefix
app.use('/api/v1', routes);

// Add root route for health checks
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running',
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

// JWT authentication
passport.use('jwt', jwtStrategy);

// Limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// Handle 404
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
