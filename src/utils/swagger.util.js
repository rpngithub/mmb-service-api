const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MakeMyBrand Service API',
      version: '1.0.0',
      description: 'API documentation for MakeMyBrand service subscription handling',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local development server',
      },
      {
        url: 'https://mmb-service-api.vercel.app/api',
        description: 'Staging server',
      },
    ],
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Authentication and token management' },
      { name: 'Users', description: 'User management (Admin/Support only)' },
      { name: 'Plans', description: 'Subscription plan management' },
      { name: 'Subscriptions', description: 'Subscription lifecycle and payments' },
      { name: 'Designs', description: 'Design catalog management' },
      { name: 'Businesses', description: 'Business type management' },
      { name: 'User Businesses', description: 'User-business associations' },
      { name: 'Profile', description: 'Authenticated user profile' },
      { name: 'User Designs', description: 'User design assignments' },
      { name: 'Inquiries', description: 'Customer inquiry submissions' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token from /auth/signin or /auth/signup',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
        IdParam: {
          type: 'string',
          description: 'Resource UUID',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
