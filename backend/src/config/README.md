# Config Directory

This directory contains configuration modules.

## Structure

```
config/
├── index.ts             # Config aggregation
├── oauth.ts             # OAuth configuration
├── session.ts           # Session configuration
├── security.ts          # Security configuration
├── websocket.ts         # WebSocket configuration
└── logging.ts           # Logging configuration
```

## Configuration Descriptions

### index.ts
Aggregates all configuration modules.

**Exports:**
- Combined configuration object
- Environment validation
- Configuration getters

### oauth.ts
Google OAuth configuration.

**Options:**
- Client ID
- Client secret
- Callback URL
- Scopes
- Token endpoint

### session.ts
Session management configuration.

**Options:**
- Session TTL
- Refresh threshold
- Max active sessions
- Cleanup interval
- Token algorithm

### security.ts
Security configuration.

**Options:**
- Rate limit settings
- CORS origins
- CSP directives
- Allowed directories
- Blocked commands

### websocket.ts
WebSocket configuration.

**Options:**
- Heartbeat interval
- Connection timeout
- Max message size
- Reconnect settings
- Ping interval

### logging.ts
Logging configuration.

**Options:**
- Log level
- Log format
- Output destination
- Redaction rules
