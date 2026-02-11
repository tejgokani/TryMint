# Backend WebSocket

> WebSocket server for real-time communication

## Purpose

Manages WebSocket connections for real-time communication between the backend, frontend clients, and agents. Handles message routing, broadcasting, and connection lifecycle.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | WebSocket server setup and initialization |
| `handlers.js` | Message type handlers |
| `channels.js` | Channel/room management |
| `broadcast.js` | Broadcasting utilities |
| `auth.js` | WebSocket authentication |
| `types.js` | Message type definitions |

## Server Setup (index.js)

- Initialize WebSocket server
- Attach to HTTP server
- Configure ping/pong heartbeat
- Handle connection events
- Route messages to handlers

## Message Handlers (handlers.js)

| Handler | Message Type | Purpose |
|---------|--------------|---------|
| `handleCommandSubmit` | `command:submit` | New command from client |
| `handleExecutionCancel` | `execution:cancel` | Cancel request |
| `handleSessionRefresh` | `session:refresh` | Refresh credentials |
| `handleAgentResponse` | `agent:response` | Response from agent |
| `handleAgentOutput` | `agent:output` | PTY output from agent |

## Channels (channels.js)

| Channel | Subscribers | Purpose |
|---------|-------------|---------|
| `session:{id}` | Frontend client | Session-specific updates |
| `agent:{id}` | Single agent | Agent-specific messages |
| `user:{id}` | All user clients | User-level broadcasts |

## Broadcasting (broadcast.js)

| Function | Purpose |
|----------|---------|
| `toSession(sessionId, event, data)` | Send to session |
| `toAgent(agentId, event, data)` | Send to agent |
| `toUser(userId, event, data)` | Send to all user clients |
| `toAll(event, data)` | Broadcast to all |

## Message Flow

```
Frontend                 Backend                    Agent
   │                        │                         │
   │─── command:submit ────►│                         │
   │                        │─── agent:simulate ─────►│
   │                        │                         │
   │                        │◄── agent:simResult ─────│
   │◄── simulation:result ──│                         │
   │                        │                         │
   │─── command:approve ───►│                         │
   │                        │─── agent:execute ──────►│
   │                        │                         │
   │                        │◄── agent:output ────────│
   │◄── execution:output ───│                         │
   │                        │                         │
   │                        │◄── agent:complete ──────│
   │◄── execution:complete ─│                         │
```

## Authentication (auth.js)

- Validate connection token
- Extract session from handshake
- Bind connection to session
- Handle token refresh
- Clean up on disconnect
