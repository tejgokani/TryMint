# Session Teardown

> Logout and Cleanup Process

---

## 📋 Overview

This document describes the mandatory teardown process triggered on logout.

---

## 🚪 Teardown Triggers

| Trigger | Description |
|---------|-------------|
| User Logout | User clicks logout button |
| Session Expiry | Session TTL exceeded |
| Admin Action | Administrator forces logout |
| Security Event | Suspicious activity detected |

---

## 🔄 Teardown Sequence

```
┌──────────────────────────────────────────────────────────────────┐
│                      TEARDOWN SEQUENCE                            │
└──────────────────────────────────────────────────────────────────┘

  Frontend              Backend                Agent
     │                     │                      │
     │ POST /auth/logout   │                      │
     │────────────────────>│                      │
     │                     │                      │
     │                     │ WS: session:teardown │
     │                     │─────────────────────>│
     │                     │                      │
     │                     │                      │ Kill PTY
     │                     │                      │ Clear creds
     │                     │                      │
     │                     │ WS: teardown:ack     │
     │                     │<─────────────────────│
     │                     │                      │
     │                     │ Close WebSocket      │
     │                     │─────────────────────>│
     │                     │                      │
     │                     │ Revoke session       │
     │                     │ Clear tokens         │
     │                     │                      │
     │ 200 OK              │                      │
     │<────────────────────│                      │
     │                     │                      │
     │ Clear storage       │                      │
     │ Redirect            │                      │
```

---

## 📋 Component Responsibilities

### Frontend

**Actions on Logout**:
1. Send logout request to backend
2. Clear local storage
3. Clear session storage
4. Clear cookies (if any)
5. Reset application state
6. Redirect to login page

### Backend

**Actions on Logout**:
1. Validate logout request
2. Send teardown to agent
3. Wait for acknowledgment (timeout: 5s)
4. Close agent WebSocket
5. Revoke session token
6. Revoke agent credentials
7. Mark session as terminated
8. Log logout event

### Agent

**Actions on Teardown**:
1. Receive teardown message
2. Kill any running PTY processes
3. Clear credential file
4. Send acknowledgment
5. Close WebSocket connection
6. Exit daemon mode (optional)

---

## ⏱️ Teardown Timeouts

| Phase | Timeout | Action on Timeout |
|-------|---------|-------------------|
| Agent Ack | 5 seconds | Force close connection |
| PTY Kill | 2 seconds | SIGKILL |
| Cleanup | 3 seconds | Force cleanup |

---

## ⚠️ Failure Handling

### Agent Unreachable

```
1. Backend sends teardown
2. No response within timeout
3. Backend marks agent disconnected
4. Backend revokes credentials anyway
5. Session marked terminated
6. Frontend receives logout success
```

### Partial Cleanup

```
1. Track cleanup state
2. Log failed cleanup steps
3. Continue with remaining steps
4. Report partial cleanup
5. Background cleanup job
```

---

## 🔐 Security Guarantees

After teardown:

| Item | State |
|------|-------|
| Session Token | Revoked |
| Agent Credentials | Revoked + Deleted |
| WebSocket Connection | Closed |
| PTY Processes | Killed |
| Local Storage | Cleared |
| Server Session | Terminated |

---

## 🔗 Related Documents

- [Session Lifecycle](lifecycle.md)
- [Security Model](../security/model.md)
