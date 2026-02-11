# Session Lifecycle

> Session State Machine Documentation

---

## 📋 Overview

This document describes the session lifecycle from creation to teardown.

---

## 🔄 Session States

```
┌─────────────────┐
│   NONE          │ No session exists
└────────┬────────┘
         │ User authenticates
         ▼
┌─────────────────┐
│   CREATED       │ Session created, token issued
└────────┬────────┘
         │ Agent connects
         ▼
┌─────────────────┐
│   ACTIVE        │ Full functionality available
└────────┬────────┘
         │
    ┌────┼────┐
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│EXPIRING│ │   REFRESHED     │
└────┬───┘ └────────┬────────┘
     │              │
     │    ┌─────────┘
     │    │
     ▼    ▼
┌─────────────────┐
│   EXPIRED       │ Session timeout (no refresh)
└─────────────────┘
         
┌─────────────────┐
│   TERMINATED    │ User logout or forced teardown
└─────────────────┘
```

---

## 📊 State Descriptions

| State | Description | Allowed Operations |
|-------|-------------|-------------------|
| NONE | No active session | Login only |
| CREATED | Session created, awaiting agent | View session, connect agent |
| ACTIVE | Fully operational | All operations |
| EXPIRING | Approaching expiry | All operations + refresh |
| REFRESHED | Recently refreshed | All operations |
| EXPIRED | Session timed out | Login only |
| TERMINATED | Explicitly ended | Login only |

---

## ⏱️ Timing Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| SESSION_TTL | 3600s | Session lifetime |
| EXPIRY_WARNING | 300s | Warning before expiry |
| REFRESH_WINDOW | 600s | Time window for refresh |
| GRACE_PERIOD | 30s | Grace period after expiry |

---

## 🔄 State Transitions

### Login → CREATED

**Trigger**: Successful OAuth authentication

**Actions**:
1. Validate OAuth tokens
2. Create session record
3. Generate session token
4. Set expiration time
5. Return token to client

### CREATED → ACTIVE

**Trigger**: Agent successfully connects

**Actions**:
1. Validate agent credentials
2. Bind agent to session
3. Mark session as active
4. Notify frontend

### ACTIVE → EXPIRING

**Trigger**: Expiry warning threshold reached

**Actions**:
1. Send expiry warning to frontend
2. Allow refresh request
3. Continue normal operations

### EXPIRING → REFRESHED

**Trigger**: User/system requests refresh

**Actions**:
1. Validate current session
2. Extend expiration time
3. Issue new token (optional)
4. Reset warning state

### EXPIRING → EXPIRED

**Trigger**: Expiration time reached without refresh

**Actions**:
1. Invalidate session token
2. Disconnect agent
3. Clear credentials
4. Notify frontend

### ACTIVE → TERMINATED

**Trigger**: User logout

**Actions**:
1. Send teardown to agent
2. Wait for agent acknowledgment
3. Revoke all tokens
4. Clear all credentials
5. Mark session terminated

---

## 🚪 Teardown Process

### Normal Logout

```
1. User clicks logout
2. Frontend sends logout request
3. Backend initiates teardown
4. Backend sends teardown to agent
5. Agent clears credentials
6. Agent closes connection
7. Backend revokes tokens
8. Backend clears session
9. Frontend clears storage
10. Frontend redirects to login
```

### Forced Teardown

```
1. Admin or system triggers teardown
2. Backend sends immediate teardown
3. Agent force-clears credentials
4. All connections closed
5. Session marked terminated
```

### Expiry Teardown

```
1. Session expires
2. Backend marks expired
3. Next request triggers cleanup
4. Agent connection closed
5. Credentials invalidated
```

---

## 🔗 Related Documents

- [Credential Management](../security/credentials.md)
- [Session Endpoints](../api/sessions.md)
