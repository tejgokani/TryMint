import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const isKnown = err instanceof AppError || err.statusCode;
  const status = err.statusCode || 500;

  if (!isKnown) {
    logger.error('unhandled_error', { message: err.message, stack: err.stack });
  } else {
    logger.warn('app_error', { name: err.name, message: err.message, status });
  }

  res.status(status).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(err.details ? { details: err.details } : {})
    }
  });
}

