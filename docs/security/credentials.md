# Credential Management

> TRYMINT Credential Lifecycle

---

## 📋 Overview

This document describes credential types, lifecycle, and security measures in TRYMINT.

---

## 🔑 Credential Types

### 1. OAuth Tokens

**Source**: Google OAuth
**Lifetime**: Standard OAuth expiry (~1 hour)
**Storage**: Backend only
**Purpose**: Verify user identity

| Token | Description |
|-------|-------------|
| Access Token | API access to Google |
| Refresh Token | Obtain new access tokens |
| ID Token | User identity claims |

### 2. Session Tokens

**Source**: Backend
**Lifetime**: Configurable (default: 1 hour)
**Storage**: Frontend (memory/secure storage), Backend
**Purpose**: Authenticate frontend requests

| Field | Description |
|-------|-------------|
| Session ID | Unique session identifier |
| User ID | Associated user |
| Expiry | Expiration timestamp |
| Signature | JWT signature |

### 3. Agent Credentials

**Source**: Backend
**Lifetime**: Session-bound
**Storage**: Agent (encrypted file)
**Purpose**: Authenticate agent connection

| Field | Description |
|-------|-------------|
| Credential ID | Unique credential identifier |
| Session ID | Bound session |
| Token | Authentication token |
| Expiry | Expiration timestamp |

---

## 🔄 Credential Lifecycle

### Session Token Lifecycle

```
┌─────────────────┐
│     Login       │
│  (OAuth Flow)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Token  │◄────────────┐
│  (Backend)      │             │
└────────┬────────┘             │
         │                      │
         ▼                      │
┌─────────────────┐             │
│ Return to       │             │
│ Frontend        │             │
└────────┬────────┘             │
         │                      │
         ▼                      │
┌─────────────────┐      ┌──────┴───────┐
│ Active Session  │─────►│   Refresh    │
│ (Valid Token)   │      │   Token      │
└────────┬────────┘      └──────────────┘
         │
         │ Expiry or Logout
         ▼
┌─────────────────┐
│ Token Revoked   │
│ Session Cleared │
└─────────────────┘
```

### Agent Credential Lifecycle

```
┌─────────────────┐
│ Request Agent   │
│ Credentials     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Creds  │
│ (Backend)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in Agent  │
│ (Encrypted)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Agent Connected │
│ (Authenticated) │
└────────┬────────┘
         │
         │ Logout or Expiry
         ▼
┌─────────────────┐
│ Credentials     │
│ Cleared         │
└─────────────────┘
```

---

## 🔐 Security Measures

### Storage Security

| Location | Measure |
|----------|---------|
| Frontend | Memory-only or secure storage |
| Backend | Hashed storage, memory cache |
| Agent | Encrypted file, 0600 permissions |

### Transmission Security

| Path | Measure |
|------|---------|
| Frontend ↔ Backend | HTTPS/TLS |
| Backend ↔ Agent | WSS/TLS |

### Lifecycle Security

| Phase | Measure |
|-------|---------|
| Creation | Secure random generation |
| Storage | Encryption at rest |
| Transmission | Encryption in transit |
| Expiry | Automatic invalidation |
| Deletion | Secure memory wipe |

---

## ⏰ Expiration Handling

### Before Expiry
- Monitor expiration time
- Trigger refresh before expiry
- Warn user of impending expiry

### At Expiry
- Invalidate token
- Clear stored credentials
- Force re-authentication

### After Logout
- Revoke all tokens
- Clear all storage
- Disconnect agent
- Notify all components

---

## 🔗 Related Documents

- [Security Model](model.md)
- [Session Lifecycle](../sessions/lifecycle.md)
