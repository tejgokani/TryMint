// Central error types used across the backend

export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', details) {
    super(message, 401, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized', details) {
    super(message, 403, details);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request', details) {
    super(message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details) {
    super(message, 404, details);
  }
}

export class SessionExpiredError extends AppError {
  constructor(message = 'Session expired', details) {
    super(message, 401, details);
  }
}

