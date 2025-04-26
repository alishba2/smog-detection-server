const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Smog Pay API Docs',
    version: '1.0.0',
    description: 'API documentation',
  },
  servers: [
    {
      url: 'http://localhost:8000',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './models/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
