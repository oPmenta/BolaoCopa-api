import swaggerJsDoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bolão Copa',
      version: '1.0.0',
      description: 'Documentação e Testes da API do Bolão',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*.ts'], 
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);