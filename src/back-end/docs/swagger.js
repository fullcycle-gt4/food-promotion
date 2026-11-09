const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão - Padrão REST',
      version: '1.0.0',
      description: 'Documentação oficial da API padronizada com contratos REST, erros RFC 7807 e paginação.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Ambiente de Desenvolvimento',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Caminho onde buscar as anotações OpenAPI
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;