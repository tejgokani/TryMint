# Authentication Endpoints

> Authentication API Reference

---

## POST /auth/google

Initiate Google OAuth flow.

### Request

```
POST /auth/google
Content-Type: application/json
```

**Body:**
```json
{
  "redirectUri": "http://localhost:3000/callback"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

---

## GET /auth/google/callback

Handle OAuth callback from Google.

### Request

```
GET /auth/google/callback?code=<code>&state=<state>
```

**Query Parameters:**
| Parameter | Description |
|-----------|-------------|
| code | Authorization code from Google |
| state | State parameter for CSRF protection |

### Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "User Name",
      "picture": "https://..."
    }
  }
}
```

---

## POST /auth/refresh

Refresh an expiring token.

### Request

```
POST /auth/refresh
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

## POST /auth/logout

Logout and trigger session teardown.

### Request

```
POST /auth/logout
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Side Effects

- Session revoked
- Agent disconnected
- All credentials cleared

---

## 🔗 Related Documents

- [API Overview](overview.md)
- [Session Endpoints](sessions.md)
