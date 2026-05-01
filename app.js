const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./src/middlewares/error.middleware');
const routes = require('./src/routes');

const { swaggerUi, swaggerSpec } = require('./src/utils/swagger.util');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// Logging
app.use(morgan('combined'));

// Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.'
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// API Routes

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
