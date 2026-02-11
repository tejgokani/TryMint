# Utils Directory

This directory contains utility functions.

## Structure

```
utils/
├── crypto.ts            # Cryptographic utilities
├── validation.ts        # Validation helpers
├── logger.ts            # Logging utility
├── constants.ts         # Application constants
├── errors.ts            # Custom error classes
└── index.ts             # Utility exports
```

## Utility Descriptions

### crypto.ts
Cryptographic utilities.

**Functions:**
- `generateToken()` - Generate secure token
- `hashPassword()` - Hash sensitive data
- `verifyHash()` - Verify hash
- `generateNonce()` - Generate nonce
- `signPayload()` - Sign JWT payload
- `verifySignature()` - Verify JWT signature

### validation.ts
Validation helpers.

**Functions:**
- `validateEmail()` - Email validation
- `validateCommand()` - Command validation
- `validatePath()` - Path validation
- `sanitizeInput()` - Input sanitization
- `validateToken()` - Token format validation

### logger.ts
Logging utility.

**Features:**
- Structured logging
- Log levels
- Request ID tracking
- Sensitive data redaction
- Output formatting

### constants.ts
Application constants.

**Constants:**
- `HTTP_STATUS` - HTTP status codes
- `ERROR_CODES` - Error code enumeration
- `WS_EVENTS` - WebSocket event names
- `SESSION_DEFAULTS` - Default session config

### errors.ts
Custom error classes.

**Classes:**
- `AppError` - Base application error
- `AuthError` - Authentication error
- `SessionError` - Session error
- `ValidationError` - Validation error
- `WebSocketError` - WebSocket error
