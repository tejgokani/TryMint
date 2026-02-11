# WebSocket Events

> Event Type Reference

---

## 📋 Overview

This document lists all WebSocket event types and their directions.

---

## 🔄 Event Direction Key

| Symbol | Meaning |
|--------|---------|
| → | Client/Agent to Backend |
| ← | Backend to Client/Agent |
| ↔ | Bidirectional |

---

## 🔐 Authentication Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `authenticate` | Client → Backend | Client authentication |
| `agent:authenticate` | Agent → Backend | Agent authentication |
| `authenticated` | ← Client/Agent | Authentication success |
| `auth_failed` | ← Client/Agent | Authentication failure |

---

## 📡 Session Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `session:connected` | ← Client | Session established |
| `session:expiring` | ← Client | Expiration warning |
| `session:expired` | ← Client | Session expired |
| `session:teardown` | → Agent | Initiate teardown |
| `session:refresh` | Client → Backend | Request refresh |
| `session:refreshed` | ← Client | Refresh confirmed |

---

## ⚡ Command Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `command:simulate` | Client → Backend → Agent | Request simulation |
| `command:approve` | Client → Backend → Agent | Approve execution |
| `command:reject` | Client → Backend → Agent | Reject command |
| `command:execute` | Backend → Agent | Execute command |
| `command:cancel` | Client → Backend → Agent | Cancel execution |
| `command:status` | ← Client | Status update |
| `command:complete` | ← Client | Execution complete |

---

## 🔍 Simulation Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `simulation:start` | Agent → Backend | Simulation started |
| `simulation:progress` | Agent → Backend → Client | Progress update |
| `simulation:result` | Agent → Backend → Client | Simulation complete |
| `simulation:error` | Agent → Backend → Client | Simulation failed |

---

## 💻 Terminal Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `terminal:output` | Agent → Backend → Client | PTY output chunk |
| `terminal:resize` | Client → Backend → Agent | Resize terminal |
| `terminal:clear` | Client → Backend → Agent | Clear terminal |
| `terminal:exit` | Agent → Backend → Client | Command exited |

---

## 🤖 Agent Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `agent:status` | Agent → Backend → Client | Agent status update |
| `agent:connected` | ← Client | Agent connected |
| `agent:disconnected` | ← Client | Agent disconnected |

---

## 💓 System Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `ping` | Backend → Client/Agent | Heartbeat ping |
| `pong` | Client/Agent → Backend | Heartbeat response |
| `error` | ← Client/Agent | Error message |

---

## 🔗 Related Documents

- [Protocol Specification](protocol.md)
- [Message Schemas](messages.md)
