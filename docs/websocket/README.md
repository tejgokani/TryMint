# WebSocket Protocol Documentation

> WebSocket communication protocol reference

## Purpose

Documents the WebSocket protocol used for real-time communication between frontend, backend, and agent.

## File Map

| File | Purpose |
|------|---------|
| `overview.md` | Protocol overview |
| `connection.md` | Connection lifecycle |
| `channels.md` | Channel documentation |
| `events.md` | Event type reference |
| `messages.md` | Message format schemas |
| `flow-diagrams.md` | Message flow diagrams |

## Overview (overview.md)

Contents:
- WebSocket endpoint URL
- Connection handshake
- Authentication via WebSocket
- Message framing
- Heartbeat protocol

## Connection (connection.md)

Contents:
- Connection establishment
- Authentication handshake
- Reconnection strategy
- Disconnection handling
- Error handling

## Channels (channels.md)

Channel types:
- `session:{sessionId}` - Session-specific channel
- `user:{userId}` - User-level channel
- `agent:{agentId}` - Agent-specific channel
- `broadcast` - System-wide broadcasts

## Events (events.md)

### Server → Client Events

| Event | Description |
|-------|-------------|
| `session:status` | Session state change |
| `session:expiring` | Credential expiring soon |
| `simulation:started` | Simulation began |
| `simulation:result` | Simulation completed |
| `simulation:failed` | Simulation failed |
| `execution:started` | Execution began |
| `execution:output` | PTY output chunk |
| `execution:complete` | Execution finished |
| `execution:failed` | Execution failed |
| `agent:connected` | Agent came online |
| `agent:disconnected` | Agent went offline |
| `agent:heartbeat` | Agent heartbeat |

### Client → Server Events

| Event | Description |
|-------|-------------|
| `command:submit` | Submit new command |
| `command:approve` | Approve command |
| `command:reject` | Reject command |
| `execution:cancel` | Cancel execution |
| `session:refresh` | Refresh credentials |

### Agent → Server Events

| Event | Description |
|-------|-------------|
| `agent:register` | Agent registration |
| `agent:heartbeat` | Agent heartbeat |
| `simulation:result` | Simulation result |
| `execution:output` | Execution output |
| `execution:complete` | Execution complete |

## Messages (messages.md)

Standard message format:
```
{
  "type": "event:name",
  "payload": { ... },
  "timestamp": 1234567890,
  "id": "msg-uuid"
}
```

## Flow Diagrams (flow-diagrams.md)

Sequence diagrams for:
- Command submission flow
- Simulation flow
- Approval flow
- Execution flow
- Agent connection flow
