import { buildApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = buildApp();
app.listen(env.PORT, () => {
  // Show the external port (3001) when running in Docker, internal port otherwise
  const displayPort = process.env.EXTERNAL_PORT || env.PORT;
  logger.info(`🚀 Bank API listening on http://localhost:${displayPort}  (docs: /docs)`);
});
