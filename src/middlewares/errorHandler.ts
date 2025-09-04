import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../libs/httpErrors.js';
import { logger } from '../config/logger.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    logger.warn({ err }, 'Handled error');
    return res.status(err.status).json({
      error: { message: err.message, details: err.details ?? null, status: err.status }
    });
  }
  logger.error({ err }, 'Unhandled error');
  return res.status(500).json({ error: { message: 'Internal Server Error', status: 500 } });
}
