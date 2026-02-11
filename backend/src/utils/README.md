# Backend Utilities

> Utility functions and helpers

## Purpose

Shared utility functions used across the backend. Includes cryptographic helpers, validators, custom errors, and logging.

## File Map

| File | Purpose |
|------|---------|
| `crypto.js` | Cryptographic utilities |
| `validators.js` | Validation helpers |
| `errors.js` | Custom error classes |
| `logger.js` | Logging utility |
| `helpers.js` | General helpers |
| `index.js` | Barrel export |

## File Details

### crypto.js
| Function | Purpose |
|----------|---------|
| `generateToken(length)` | Generate random token |
| `hashToken(token)` | Hash token for storage |
| `compareHash(token, hash)` | Compare token to hash |
| `generateSessionId()` | Generate session ID |
| `encryptData(data, key)` | Encrypt sensitive data |
| `decryptData(cipher, key)` | Decrypt data |

### validators.js
| Function | Purpose |
|----------|---------|
| `isValidCommand(cmd)` | Validate command string |
| `isValidPath(path)` | Validate file path |
| `isValidEmail(email)` | Validate email format |
| `sanitizeInput(input)` | Sanitize user input |

### errors.js
| Class | Purpose |
|-------|---------|
| `AppError` | Base error class |
| `AuthenticationError` | Auth failures |
| `AuthorizationError` | Permission failures |
| `ValidationError` | Validation failures |
| `NotFoundError` | Resource not found |
| `SessionExpiredError` | Expired session |

### logger.js
| Method | Purpose |
|--------|---------|
| `info(message, meta)` | Info level log |
| `warn(message, meta)` | Warning level log |
| `error(message, error)` | Error level log |
| `debug(message, meta)` | Debug level log |

### helpers.js
| Function | Purpose |
|----------|---------|
| `sleep(ms)` | Async delay |
| `retry(fn, times)` | Retry with backoff |
| `pick(obj, keys)` | Pick object keys |
| `omit(obj, keys)` | Omit object keys |
