# Services Directory

This directory contains business logic.

## Structure

```
services/
├── auth.ts              # Authentication logic
├── oauth.ts             # Google OAuth integration
├── session.ts           # Session management
├── command.ts           # Command routing
├── credential.ts        # Credential generation
└── index.ts             # Service exports
```

## Service Descriptions

### auth.ts
Core authentication logic.

**Responsibilities:**
- Validate credentials
- Issue tokens
- Verify token signatures
- Handle token refresh
- Revoke tokens

### oauth.ts
Google OAuth integration.

**Responsibilities:**
- Generate OAuth URL
- Exchange code for tokens
- Validate Google tokens
- Extract user profile
- Handle OAuth errors

### session.ts
Session lifecycle management.

**Responsibilities:**
- Create new sessions
- Generate session ID
- Set expiration time
- Track active sessions
- Handle session refresh
- Clean up expired sessions
- Enforce session limits
- Trigger teardown on logout

### command.ts
Command routing logic.

**Responsibilities:**
- Route commands to agents
- Track command status
- Store command history
- Handle approval workflow
- Manage command lifecycle

### credential.ts
Short-lived credential generation.

**Responsibilities:**
- Generate agent credentials
- Set credential expiration
- Validate credentials
- Revoke credentials
- Track credential usage
