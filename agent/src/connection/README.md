# Agent Connection

> WebSocket connection management

## Purpose

Manages the WebSocket connection between the agent and the backend server. Handles connection lifecycle, message routing, reconnection, and heartbeat.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Connection manager class |
| `handlers.js` | Incoming message handlers |
| `reconnect.js` | Reconnection logic |
| `heartbeat.js` | Heartbeat management |

## Connection Lifecycle

```
DISCONNECTED → CONNECTING → CONNECTED → AUTHENTICATED
      ↑              │            │            │
      │              ▼            │            │
      └───────── FAILED ◄────────┘            │
      │                                        │
      └──────────── TERMINATED ◄──────────────┘
```

## Message Handlers

| Message Type | Handler | Action |
|--------------|---------|--------|
| `auth:success` | onAuthSuccess | Mark authenticated |
| `auth:failed` | onAuthFailed | Handle auth failure |
| `command:simulate` | onSimulate | Trigger simulation |
| `command:execute` | onExecute | Trigger execution |
| `command:cancel` | onCancel | Cancel running command |
| `session:terminate` | onTerminate | Clean shutdown |
| `ping` | onPing | Respond with pong |

## Reconnection Logic

- Automatic reconnection on disconnect
- Exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Max retry attempts: 10
- Re-authenticate on reconnect
- Queue messages during disconnect

## Heartbeat

- Send heartbeat every 30 seconds
- Expect response within 10 seconds
- Disconnect if no response
- Include agent status in heartbeat

## Outgoing Messages

| Function | Message Type | Purpose |
|----------|--------------|---------|
| `sendSimulationResult(result)` | `simulation:result` | Send sim result |
| `sendExecutionOutput(chunk)` | `execution:output` | Stream output |
| `sendExecutionComplete(result)` | `execution:complete` | Execution done |
| `sendHeartbeat()` | `heartbeat` | Heartbeat ping |
| `sendError(error)` | `error` | Report error |
