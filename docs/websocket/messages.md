# WebSocket Message Schemas

> Message Payload Schemas

---

## 📋 Overview

This document defines the payload schemas for WebSocket messages.

---

## 🔐 Authentication Messages

### authenticate (Client)

```json
{
  "type": "authenticate",
  "payload": {
    "token": "jwt_token_here"
  }
}
```

### agent:authenticate (Agent)

```json
{
  "type": "agent:authenticate",
  "payload": {
    "credentials": "agent_credential_token",
    "sessionId": "session_abc123"
  }
}
```

### authenticated (Response)

```json
{
  "type": "authenticated",
  "payload": {
    "sessionId": "session_abc123",
    "userId": "user_123",
    "expiresAt": "2024-01-01T01:00:00Z"
  }
}
```

---

## ⚡ Command Messages

### command:simulate

```json
{
  "type": "command:simulate",
  "payload": {
    "commandId": "cmd_123",
    "command": "ls -la /Users/user/projects",
    "workingDirectory": "/Users/user"
  }
}
```

### command:approve

```json
{
  "type": "command:approve",
  "payload": {
    "commandId": "cmd_123"
  }
}
```

### command:reject

```json
{
  "type": "command:reject",
  "payload": {
    "commandId": "cmd_123",
    "reason": "Optional rejection reason"
  }
}
```

---

## 🔍 Simulation Messages

### simulation:result

```json
{
  "type": "simulation:result",
  "payload": {
    "commandId": "cmd_123",
    "riskLevel": "low",
    "affectedPaths": [
      "/Users/user/projects/file1.txt",
      "/Users/user/projects/file2.txt"
    ],
    "preview": {
      "stdout": "simulated output...",
      "changes": [
        {
          "path": "/Users/user/projects/file1.txt",
          "operation": "read"
        }
      ]
    },
    "warnings": [],
    "canExecute": true
  }
}
```

### simulation:error

```json
{
  "type": "simulation:error",
  "payload": {
    "commandId": "cmd_123",
    "error": {
      "code": "CAPABILITY_DENIED",
      "message": "Access denied to /etc/passwd"
    }
  }
}
```

---

## 💻 Terminal Messages

### terminal:output

```json
{
  "type": "terminal:output",
  "payload": {
    "commandId": "cmd_123",
    "data": "base64_encoded_output",
    "encoding": "base64"
  }
}
```

### terminal:exit

```json
{
  "type": "terminal:exit",
  "payload": {
    "commandId": "cmd_123",
    "exitCode": 0,
    "signal": null
  }
}
```

### terminal:resize

```json
{
  "type": "terminal:resize",
  "payload": {
    "cols": 80,
    "rows": 24
  }
}
```

---

## 📡 Session Messages

### session:expiring

```json
{
  "type": "session:expiring",
  "payload": {
    "sessionId": "session_abc123",
    "expiresIn": 300,
    "canRefresh": true
  }
}
```

### session:teardown

```json
{
  "type": "session:teardown",
  "payload": {
    "sessionId": "session_abc123",
    "reason": "user_logout"
  }
}
```

---

## 🤖 Agent Messages

### agent:status

```json
{
  "type": "agent:status",
  "payload": {
    "status": "ready",
    "capabilities": [
      {
        "path": "/Users/user/projects",
        "permissions": ["read", "write", "execute"]
      }
    ],
    "platform": "darwin",
    "version": "0.1.0"
  }
}
```

---

## ⚠️ Error Messages

### error

```json
{
  "type": "error",
  "payload": {
    "code": "SESSION_EXPIRED",
    "message": "Your session has expired",
    "details": {}
  }
}
```

---

## 🔗 Related Documents

- [Protocol Specification](protocol.md)
- [Event Reference](events.md)
