# Session Endpoints

> Session Management API Reference

---

## GET /session/current

Get current session details.

### Request

```
GET /session/current
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session_abc123",
      "userId": "user_123",
      "createdAt": "2024-01-01T00:00:00Z",
      "expiresAt": "2024-01-01T01:00:00Z",
      "isActive": true,
      "agentConnected": true,
      "capabilities": [
        {
          "path": "/Users/user/projects",
          "permissions": ["read", "write", "execute"],
          "recursive": true
        }
      ]
    }
  }
}
```

---

## GET /session/status

Check session status (lightweight).

### Request

```
GET /session/status
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "isValid": true,
    "expiresIn": 1800,
    "agentConnected": true
  }
}
```

---

## POST /session/refresh

Refresh session to extend expiration.

### Request

```
POST /session/refresh
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "session_abc123",
      "expiresAt": "2024-01-01T02:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

## GET /session/agent-token

Get credentials for agent connection.

### Request

```
GET /session/agent-token
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "credentials": {
      "token": "agent_credential_token",
      "expiresAt": "2024-01-01T01:00:00Z",
      "websocketUrl": "wss://api.trymint.app/ws",
      "sessionId": "session_abc123"
    }
  }
}
```

### Usage

Agent uses these credentials to establish WebSocket connection.

---

## DELETE /session/revoke

Revoke current session (alternative to logout).

### Request

```
DELETE /session/revoke
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "message": "Session revoked"
  }
}
```

---

## 🔗 Related Documents

- [API Overview](overview.md)
- [Authentication Endpoints](authentication.md)
- [Session Lifecycle](../sessions/lifecycle.md)
