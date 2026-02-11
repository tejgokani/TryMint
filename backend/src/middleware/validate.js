// Very small validation middleware wrapper that delegates to util validators.

import { validateCommandPayload, validateExecutionPayload } from '../utils/validators.js';

export function validateCommand(req, res, next) {
  try {
    validateCommandPayload(req.body || {});
    next();
  } catch (err) {
    next(err);
  }
}

export function validateExecution(req, res, next) {
  try {
    validateExecutionPayload(req.body || {});
    next();
  } catch (err) {
    next(err);
  }
}

