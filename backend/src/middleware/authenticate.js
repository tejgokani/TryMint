// Very lightweight authentication middleware.
// For now we assume an upstream OAuth flow has already issued a JWT that
// encodes at least { userId }. We do NOT store OAuth tokens here.

import jwt from 'jsonwebtoken';
import { authConfig } from '../config/index.js';
import { AuthenticationError } from '../utils/errors.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return next(new AuthenticationError('Missing Authorization header'));
  }

  try {
    const payload = jwt.verify(token, authConfig.jwtSecret);
    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name
    };
    next();
  } catch (err) {
    next(new AuthenticationError('Invalid token'));
  }
}

