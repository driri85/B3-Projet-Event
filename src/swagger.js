// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger configuration options
const options = {
  definition: {
    openapi: '3.0.0', // Use OpenAPI 3.0 specification
    info: {
      title: 'Event API', // API title
      version: '1.0.0',   // Version of the API
      description: 'API documentation for the Event project' // Short description
    },
    servers: [
      {
        url: 'http://localhost:3000', // Base URL of your API
        description: 'Local server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/app.js','./src/user/*.js', './src/event/*.js', './src/auth/*.js'], // Files containing Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
