# Backend Middleware

> Express middleware functions

## Purpose

Middleware functions that process requests before they reach controllers. Handle cross-cutting concerns like authentication, validation, logging, and error handling.

## File Map

| File | Purpose |
|------|---------|
| `authenticate.js` | JWT/session token verification |
| `authorize.js` | Permission and role checking |
| `validate.js` | Request body/params validation |
| `rateLimit.js` | Rate limiting per client |
| `errorHandler.js` | Global error handling |
| `logger.js` | Request/response logging |
| `cors.js` | CORS configuration |
| `index.js` | Barrel export |

## Middleware Details

### authenticate.js
- Extract token from header/cookie
- Verify token signature
- Attach user to request
- Reject invalid tokens

### authorize.js
- Check user permissions
- Verify session ownership
- Validate agent binding

### validate.js
- Schema-based validation
- Request body validation
- Query param validation
- Path param validation
- Return 400 on failure

### rateLimit.js
- Per-IP rate limiting
- Per-user rate limiting
- Configurable windows
- 429 response on exceed

### errorHandler.js
- Catch all errors
- Format error response
- Log errors
- Hide stack in production

### logger.js
- Log request method/path
- Log response status
- Log timing
- Log errors

### cors.js
- Configure allowed origins
- Configure allowed methods
- Configure allowed headers
- Handle preflight

## Middleware Order

```
1. logger
2. cors
3. rateLimit
4. authenticate (on protected routes)
5. validate (on routes with body)
6. authorize (on restricted routes)
7. controller
8. errorHandler (catch-all)
```
