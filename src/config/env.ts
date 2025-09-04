import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.string().default('info'),
  IDEMPOTENCY_TTL_SECONDS: z.coerce.number().default(86400)
});

export const env = EnvSchema.parse(process.env);
