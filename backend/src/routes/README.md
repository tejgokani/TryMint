# Routes Directory

This directory contains HTTP route definitions.

## Structure

```
routes/
├── auth.ts              # Authentication routes
├── session.ts           # Session management routes
├── command.ts           # Command routes
├── health.ts            # Health check routes
└── index.ts             # Route aggregation
```

## Route Descriptions

### auth.ts
Authentication and OAuth routes.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Handle OAuth callback |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and teardown |

### session.ts
Session management routes.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/session/current` | Get current session |
| GET | `/session/status` | Check session status |
| POST | `/session/refresh` | Refresh session |
| GET | `/session/agent-token` | Get agent credentials |
| DELETE | `/session/revoke` | Revoke session |

### command.ts
Command history routes.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/commands/history` | Get command history |
| GET | `/commands/:id` | Get specific command |

### health.ts
Health and status routes.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health check |
| GET | `/health/ready` | Readiness check |
| GET | `/health/live` | Liveness check |
