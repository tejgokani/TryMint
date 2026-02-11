# Backend Configuration

> Application configuration management

## Purpose

Centralized configuration for all backend services. Supports environment-based configuration with sensible defaults.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Configuration aggregator and exporter |
| `app.js` | General app settings (port, env, etc.) |
| `auth.js` | OAuth provider configuration |
| `database.js` | Database connection settings |
| `session.js` | Session and credential settings |
| `websocket.js` | WebSocket server settings |

## Configuration Areas

### app.js
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging verbosity
- `CORS_ORIGIN` - Allowed origins

### auth.js
- `GOOGLE_CLIENT_ID` - OAuth client ID
- `GOOGLE_CLIENT_SECRET` - OAuth client secret
- `GOOGLE_CALLBACK_URL` - OAuth redirect URI
- `JWT_SECRET` - Token signing secret
- `JWT_EXPIRY` - Token expiration time

### database.js
- `DB_TYPE` - Database type (memory/redis/postgres)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name

### session.js
- `SESSION_TTL` - Session time-to-live
- `CREDENTIAL_TTL` - Credential expiry time
- `REFRESH_WINDOW` - Refresh allowed window
- `MAX_SESSIONS_PER_USER` - Session limit

### websocket.js
- `WS_PATH` - WebSocket endpoint path
- `PING_INTERVAL` - Heartbeat interval
- `PING_TIMEOUT` - Connection timeout

## Environment Variables

All configuration reads from environment variables with defaults:

```
TRYMINT_PORT=3000
TRYMINT_ENV=development
TRYMINT_LOG_LEVEL=info
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
...
```
