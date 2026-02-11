# Types Directory

> Type definitions and schemas

## Purpose

This directory contains type definitions, interfaces, and schemas used throughout the frontend application.

## File Map

| File | Purpose |
|------|---------|
| `auth.js` | Authentication-related types |
| `session.js` | Session-related types |
| `command.js` | Command-related types |
| `websocket.js` | WebSocket message types |
| `api.js` | API request/response types |
| `index.js` | Barrel export for all types |

## Type Definitions

### auth.js
- User
- AuthState
- LoginCredentials
- OAuthResponse

### session.js
- Session
- SessionState
- SessionCredentials
- SessionStatus

### command.js
- Command
- CommandStatus
- CommandResult
- CommandHistoryItem

### websocket.js
- WebSocketMessage
- WebSocketEvent
- SimulationMessage
- ExecutionMessage
- SessionMessage

### api.js
- ApiResponse
- ApiError
- PaginatedResponse
- RequestConfig

## JSDoc Pattern

Types are documented using JSDoc for IDE support:

```javascript
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} picture
 */
```
