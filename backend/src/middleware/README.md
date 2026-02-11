# Middleware Directory

This directory contains Express middleware functions.

## Structure

```
middleware/
├── auth.ts              # Authentication middleware
├── session.ts           # Session validation
├── rateLimit.ts         # Rate limiting
├── validation.ts        # Request validation
├── errorHandler.ts      # Error handling
├── logging.ts           # Request logging
├── cors.ts              # CORS configuration
├── security.ts          # Security headers
└── index.ts             # Middleware exports
```

## Middleware Descriptions

### auth.ts
Authentication verification.

**Functions:**
- `requireAuth()` - Require valid token
- `optionalAuth()` - Optional authentication
- `extractToken()` - Extract token from header

### session.ts
Session validation.

**Functions:**
- `requireSession()` - Require active session
- `validateSessionToken()` - Validate session token
- `checkSessionExpiry()` - Check expiration

### rateLimit.ts
Rate limiting protection.

**Functions:**
- `apiRateLimit()` - API rate limiting
- `authRateLimit()` - Auth endpoint limiting
- `wsRateLimit()` - WebSocket rate limiting

### validation.ts
Request validation.

**Functions:**
- `validateBody()` - Validate request body
- `validateParams()` - Validate URL params
- `validateQuery()` - Validate query string

### errorHandler.ts
Error handling.

**Functions:**
- `errorHandler()` - Global error handler
- `notFoundHandler()` - 404 handler
- `asyncHandler()` - Async error wrapper

### logging.ts
Request logging.

**Functions:**
- `requestLogger()` - Log incoming requests
- `responseLogger()` - Log responses

### cors.ts
CORS configuration.

**Functions:**
- `corsMiddleware()` - CORS headers

### security.ts
Security headers.

**Functions:**
- `securityHeaders()` - Set security headers
- `contentSecurityPolicy()` - CSP headers
