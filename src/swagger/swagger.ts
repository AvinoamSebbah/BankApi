import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';

export function mountSwagger(app: Express) {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: { 
        title: 'Bank API', 
        version: '1.0.0',
        description: 'REST API for bank backoffice operations',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'http://localhost:3001',
          description: 'Docker container'
        }
      ]
    },
    apis: [
      './src/routes/*.ts',  // For development
      './dist/src/routes/*.js'  // For production
    ]
  };
  const spec = swaggerJSDoc(options);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));
}
