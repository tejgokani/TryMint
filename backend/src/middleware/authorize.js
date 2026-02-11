// Simple authorization helpers.
// For now this just ensures the authenticated user can access a given session.

import { sessionService } from '../services/index.js';
import { AuthorizationError } from '../utils/errors.js';

export function requireSessionOwnership(req, res, next) {
  const sessionId = req.body?.sessionId || req.query?.sessionId;
  if (!sessionId) {
    return next(new AuthorizationError('Missing sessionId'));
  }
  const session = sessionService.getSession(sessionId);
  if (session.userId !== req.user.id) {
    return next(new AuthorizationError('You do not own this session'));
  }
  next();
}

