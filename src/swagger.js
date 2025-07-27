// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path'); //  Add path module

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event API',
      version: '1.0.0',
      description: 'API documentation for the Event project'
    },
    servers: [
      {
        url: 'http://localhost:3000/api-docs',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',               //  This should be "http" not "https"
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: [
    path.resolve(__dirname, 'src/app.js'),
    path.resolve(__dirname, 'src/user/*.js'),
    path.resolve(__dirname, 'src/event/*.js'),
    path.resolve(__dirname, 'src/auth/*.js'),
  ],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
