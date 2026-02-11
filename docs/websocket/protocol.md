# WebSocket Protocol

> TRYMINT WebSocket Protocol Specification

---

## 📋 Overview

TRYMINT uses WebSocket for real-time bidirectional communication between frontend, backend, and agent.

---

## 🔌 Connection

### Endpoint

```
Development: ws://localhost:3001/ws
Production:  wss://api.trymint.app/ws
```

### Connection Parameters

| Parameter | Description |
|-----------|-------------|
| token | Authentication token (query param or header) |
| type | Connection type: `client` or `agent` |

### Connection URL Example

```
wss://api.trymint.app/ws?token=<jwt>&type=client
```

---

## 📦 Message Format

All messages follow this structure:

```json
{
  "type": "event_type",
  "payload": { ... },
  "timestamp": "2024-01-01T00:00:00Z",
  "id": "msg_unique_id"
}
```

| Field | Type | Description |
|-------|------|-------------|
| type | string | Event type identifier |
| payload | object | Event-specific data |
| timestamp | string | ISO 8601 timestamp |
| id | string | Unique message ID |

---

## 🤝 Handshake

### Client Connection

```
1. Client connects to WebSocket endpoint
2. Client sends: { type: "authenticate", payload: { token: "..." } }
3. Server validates token
4. Server sends: { type: "authenticated", payload: { sessionId: "..." } }
```

### Agent Connection

```
1. Agent connects to WebSocket endpoint
2. Agent sends: { type: "agent:authenticate", payload: { credentials: "..." } }
3. Server validates credentials
4. Server sends: { type: "authenticated", payload: { sessionId: "..." } }
```

---

## 💓 Heartbeat

### Ping/Pong

```
Server → Client: { type: "ping" }
Client → Server: { type: "pong" }
```

**Interval**: 30 seconds
**Timeout**: 10 seconds (disconnect if no pong)

---

## 🔄 Reconnection

### Strategy

- Initial delay: 1 second
- Max delay: 30 seconds
- Backoff multiplier: 2x
- Max attempts: 10

### On Reconnect

- Re-authenticate with same token
- Resume session if still valid
- Re-subscribe to events

---

## ⚠️ Error Messages

```json
{
  "type": "error",
  "payload": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

| Code | Description |
|------|-------------|
| `AUTH_FAILED` | Authentication failed |
| `SESSION_EXPIRED` | Session expired |
| `INVALID_MESSAGE` | Malformed message |
| `RATE_LIMITED` | Too many messages |

---

## 🔗 Related Documents

- [Event Reference](events.md)
- [Message Schemas](messages.md)
