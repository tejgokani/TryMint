# Session Credentials

> Session Credential Generation

---

## 📋 Overview

This document describes how session credentials are generated and managed.

---

## 🔑 Credential Types

### User Session Token

**Purpose**: Authenticate frontend requests

**Generation**:
1. User completes OAuth
2. Backend generates JWT
3. Token contains user ID, session ID, expiry
4. Token signed with server secret

**Contents**:
```
{
  "sub": "user_123",
  "sid": "session_abc",
  "iat": 1704067200,
  "exp": 1704070800,
  "type": "session"
}
```

### Agent Credentials

**Purpose**: Authenticate agent WebSocket connection

**Generation**:
1. User requests agent credentials
2. Backend generates credential token
3. Credentials bound to session
4. Short-lived (session-bound expiry)

**Contents**:
```
{
  "cid": "cred_xyz",
  "sid": "session_abc",
  "iat": 1704067200,
  "exp": 1704070800,
  "type": "agent"
}
```

---

## 🔄 Generation Flow

### Session Token

```
User Login
    │
    ▼
OAuth Callback
    │
    ▼
Validate Google Tokens
    │
    ▼
Create Session Record
    │
    ▼
Generate Session ID ────────────────────┐
    │                                   │
    ▼                                   │
Build JWT Payload                       │
    │                                   │
    ▼                                   │
Sign with Server Secret                 │
    │                                   │
    ▼                                   │
Return Token ◄──────────────────────────┘
```

### Agent Credentials

```
User Requests Credentials
    │
    ▼
Validate Session
    │
    ▼
Generate Credential ID
    │
    ▼
Create Credential Record
    │
    ▼
Build Credential Token
    │
    ▼
Sign Token
    │
    ▼
Return Credentials + WebSocket URL
```

---

## 🔐 Security Properties

### Session Token

| Property | Value |
|----------|-------|
| Algorithm | HS256 or RS256 |
| Lifetime | 1 hour (configurable) |
| Storage | Frontend secure storage |
| Transmission | HTTPS only |

### Agent Credentials

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Lifetime | Session-bound |
| Storage | Encrypted local file |
| Transmission | WSS only |

---

## 🔗 Related Documents

- [Session Lifecycle](lifecycle.md)
- [Credential Security](../security/credentials.md)
