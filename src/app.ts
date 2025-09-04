import express from 'express';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';
import { mountSwagger } from './swagger/swagger.js';

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(requestLogger);

  /**
   * @openapi
   * /healthz:
   *   get:
   *     summary: Health check endpoint
   *     description: Returns the health status of the API
   *     tags:
   *       - Health
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: "ok"
   */
  app.get('/healthz', (_req, res) => res.json({ status: 'ok' }));
  mountSwagger(app);
  app.use(routes);

  app.use(errorHandler);
  return app;
}
