# Session Documentation

> Session lifecycle and credential management

## Purpose

Documents the session lifecycle from creation to teardown, including credential management and timeout handling.

## File Map

| File | Purpose |
|------|---------|
| `lifecycle.md` | Complete session lifecycle |
| `credentials.md` | Credential management |
| `timeout.md` | Timeout and expiry handling |
| `teardown.md` | Mandatory logout teardown |
| `binding.md` | Agent-session binding |

## Lifecycle (lifecycle.md)

Session states and transitions:
```
CREATED → ACTIVE → EXPIRING → EXPIRED
            │          │
            ▼          │
       TERMINATED ◄────┘
```

Contents:
- Session creation process
- Session activation
- Session refresh
- Session expiry
- Session termination

## Credentials (credentials.md)

Contents:
- Credential generation
- Short-lived token design
- Credential refresh flow
- Credential revocation
- Capability attachment

Credential properties:
- Token: cryptographically random
- TTL: 15 minutes (configurable)
- Refresh window: last 5 minutes
- Capabilities: bound directory list

## Timeout (timeout.md)

Timeout types:
- Session idle timeout
- Credential expiry
- Agent heartbeat timeout
- WebSocket ping timeout

Timeout values:
- Session: 2 hours
- Credential: 15 minutes
- Agent heartbeat: 60 seconds
- WebSocket ping: 30 seconds

## Teardown (teardown.md)

Mandatory logout process:
1. Revoke all credentials
2. Terminate agent connection
3. Clear session data
4. Invalidate tokens
5. Cleanup resources

Contents:
- Normal logout flow
- Forced logout flow
- Cleanup responsibilities
- Post-logout state

## Binding (binding.md)

Agent-session binding:
- One agent per session
- Session token required for binding
- Binding verified on each command
- Unbinding on logout
