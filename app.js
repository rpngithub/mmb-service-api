const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const { errorHandler } = require('./src/middlewares/error.middleware');
const routes = require('./src/routes');
const generalLimiter = require('./src/middlewares/rateLimit.middleware');

const { swaggerUi, swaggerSpec } = require('./src/utils/swagger.util');

const app = express();

app.set('trust proxy', 1); // Trust first proxy for rate limiting and secure cookies

// Security Middlewares
app.use(helmet());
// Parse allowed origins from environment variable
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser
app.use(cookieParser());

// API Routes

// Swagger API Docs
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use('/api', generalLimiter, routes);


if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '../public_html');
  const serverPath = __dirname; // actual server files are in the root of src, so we can serve from there
  // const websitePath = path.join(serverPath, 'website');
  // const adminPath = path.join(serverPath, 'admin');
  /*
|--------------------------------------------------------------------------
| MAIN WEBSITE
|--------------------------------------------------------------------------
*/

  app.use(
    '/',
    express.static(path.join(serverPath, 'website'))
  );

  /*
  |--------------------------------------------------------------------------
  | ADMIN PANEL STATIC
  |--------------------------------------------------------------------------
  */

  // app.use(
  //   '/admin',
  //   express.static(path.join(serverPath, 'admin'))
  // );

  /*
  |--------------------------------------------------------------------------
  | ADMIN REACT ROUTER
  |--------------------------------------------------------------------------
  */

  // app.get('/admin/*', (req, res) => {
  //   res.sendFile(
  //     path.join(serverPath, 'admin/index.html')
  //   );
  // });

  /*
  |--------------------------------------------------------------------------
  | MAIN WEBSITE REACT ROUTER
  |--------------------------------------------------------------------------
  */

  app.get(/.*/, (req, res) => {
    res.sendFile(
      path.join(serverPath, 'website/index.html')
    );
  });
}


// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
