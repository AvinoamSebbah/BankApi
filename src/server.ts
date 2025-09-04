import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = buildApp();
app.listen(env.PORT, () => {
  logger.info(`🚀 Bank API listening on http://localhost:${env.PORT}  (docs: /docs)`);
});
