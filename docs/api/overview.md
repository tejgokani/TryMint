# API Overview

> TRYMINT REST API Documentation

---

## 📋 Overview

This document provides an overview of the TRYMINT REST API design and conventions.

---

## 🌐 Base URL

```
Development: http://localhost:3001
Production:  https://api.trymint.app
```

---

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  }
}
```

---

## 📑 Endpoints Summary

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/google` | Initiate Google OAuth | No |
| GET | `/auth/google/callback` | OAuth callback | No |
| POST | `/auth/refresh` | Refresh token | Yes |
| POST | `/auth/logout` | Logout and teardown | Yes |
| GET | `/session/current` | Get current session | Yes |
| GET | `/session/status` | Check session status | Yes |
| POST | `/session/refresh` | Refresh session | Yes |
| GET | `/session/agent-token` | Get agent credentials | Yes |
| GET | `/commands/history` | Get command history | Yes |
| GET | `/commands/:id` | Get specific command | Yes |
| GET | `/health` | Health check | No |

---

## ⚠️ Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Authentication required |
| `AUTH_INVALID` | Invalid authentication |
| `AUTH_EXPIRED` | Token expired |
| `SESSION_INVALID` | Invalid session |
| `SESSION_EXPIRED` | Session expired |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `RATE_LIMITED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## 🚦 Rate Limiting

| Endpoint Type | Limit |
|--------------|-------|
| Authentication | 10 requests/minute |
| API | 100 requests/minute |
| WebSocket | Connection limit per user |

---

## 🔗 Related Documents

- [Authentication Endpoints](authentication.md)
- [Session Endpoints](sessions.md)
- [Command Endpoints](commands.md)
