# Controllers Directory

This directory contains route handler logic.

## Structure

```
controllers/
├── auth.ts              # Authentication handlers
├── session.ts           # Session handlers
├── command.ts           # Command handlers
└── health.ts            # Health check handlers
```

## Controller Responsibilities

### auth.ts
Handles authentication requests.

**Functions:**
- `initiateGoogleOAuth()` - Start OAuth flow
- `handleOAuthCallback()` - Process OAuth response
- `refreshToken()` - Handle token refresh
- `logout()` - Process logout and teardown

### session.ts
Handles session management requests.

**Functions:**
- `getCurrentSession()` - Return current session
- `getSessionStatus()` - Return session status
- `refreshSession()` - Extend session
- `getAgentToken()` - Generate agent credentials
- `revokeSession()` - Revoke and cleanup

### command.ts
Handles command-related requests.

**Functions:**
- `getCommandHistory()` - Return command history
- `getCommand()` - Return specific command
- `deleteCommand()` - Remove from history

### health.ts
Handles health check requests.

**Functions:**
- `healthCheck()` - Basic health status
- `readinessCheck()` - Service readiness
- `livenessCheck()` - Service liveness

## Conventions

- Controllers handle request/response only
- Business logic delegated to services
- Input validation via middleware
- Consistent error response format
