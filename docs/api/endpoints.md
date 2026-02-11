# API Endpoints Reference

> Complete REST API endpoint documentation

## Base URL

```
Production: https://api.trymint.io/v1
Development: http://localhost:3000/v1
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer <session_token>
```

---

## Authentication Endpoints

### POST /auth/google
Initiate Google OAuth flow.

**Request:**
```json
{
  "redirectUri": "https://app.trymint.io/auth/callback"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

---

### GET /auth/callback
Handle OAuth callback.

**Query Parameters:**
- `code` - Authorization code from Google
- `state` - CSRF state token

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-abc123",
      "email": "user@example.com",
      "name": "User Name",
      "picture": "https://..."
    }
  }
}
```

---

### POST /auth/logout
Logout and terminate session.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### GET /auth/me
Get current user info.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-abc123",
      "email": "user@example.com",
      "name": "User Name",
      "picture": "https://..."
    }
  }
}
```

---

## Session Endpoints

### POST /session
Create new session.

**Headers:** Authorization required

**Request:**
```json
{
  "capabilities": ["/home/user/project"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-abc123",
    "credentials": {
      "token": "cred-xyz789",
      "expiresAt": 1707670800000
    },
    "status": "created"
  }
}
```

---

### GET /session
Get current session status.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess-abc123",
    "status": "active",
    "agentConnected": true,
    "capabilities": ["/home/user/project"],
    "expiresAt": 1707670800000
  }
}
```

---

### POST /session/refresh
Refresh session credentials.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "credentials": {
      "token": "cred-new123",
      "expiresAt": 1707671700000
    }
  }
}
```

---

### DELETE /session
Terminate session.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Session terminated"
  }
}
```

---

## Command Endpoints

### POST /command/simulate
Submit command for simulation.

**Headers:** Authorization required

**Request:**
```json
{
  "command": "ls -la",
  "workingDir": "/home/user/project"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "commandId": "cmd-abc123",
    "status": "simulating"
  }
}
```

---

### POST /command/execute
Execute approved command.

**Headers:** Authorization required

**Request:**
```json
{
  "commandId": "cmd-abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "commandId": "cmd-abc123",
    "status": "executing"
  }
}
```

---

### GET /command/history
Get command history.

**Headers:** Authorization required

**Query Parameters:**
- `limit` - Max results (default: 50)
- `offset` - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "commands": [
      {
        "id": "cmd-abc123",
        "command": "ls -la",
        "status": "completed",
        "exitCode": 0,
        "createdAt": 1707667200000
      }
    ],
    "total": 100
  }
}
```

---

### DELETE /command/:id
Cancel command.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Command cancelled"
  }
}
```

---

## Agent Endpoints

### POST /agent/connect
Register agent connection.

**Request:**
```json
{
  "token": "cred-xyz789",
  "version": "1.0.0",
  "os": "darwin",
  "arch": "x64"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "agent-abc123",
    "sessionId": "sess-abc123",
    "capabilities": ["/home/user/project"]
  }
}
```

---

### POST /agent/heartbeat
Agent heartbeat.

**Request:**
```json
{
  "agentId": "agent-abc123",
  "status": "idle"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "ack": true
  }
}
```

---

### POST /agent/disconnect
Disconnect agent.

**Request:**
```json
{
  "agentId": "agent-abc123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Agent disconnected"
  }
}
```

---

## Health Endpoint

### GET /health
Health check.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1707667200000,
  "version": "1.0.0"
}
```
