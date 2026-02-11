# Backend Types

> Type definitions for backend

## Purpose

Type definitions using JSDoc for JavaScript. Provides IDE support and documentation for data structures.

## File Map

| File | Purpose |
|------|---------|
| `auth.js` | Authentication types |
| `session.js` | Session types |
| `command.js` | Command types |
| `websocket.js` | WebSocket message types |
| `api.js` | API request/response types |
| `index.js` | Barrel export |

## Type Definitions

### auth.js
- `OAuthConfig`
- `OAuthTokens`
- `JWTPayload`
- `AuthenticatedUser`

### session.js
- `Session`
- `SessionStatus` (enum)
- `SessionCreateParams`
- `SessionRefreshResult`

### command.js
- `Command`
- `CommandStatus` (enum)
- `SimulationResult`
- `ExecutionResult`

### websocket.js
- `WebSocketMessage`
- `ClientMessage`
- `ServerMessage`
- `MessageType` (enum)

### api.js
- `ApiRequest`
- `ApiResponse`
- `ApiError`
- `ValidationError`

## JSDoc Pattern

```javascript
/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} userId
 * @property {SessionStatus} status
 * @property {Date} expiresAt
 */

/**
 * @typedef {'active'|'expired'|'terminated'} SessionStatus
 */
```
