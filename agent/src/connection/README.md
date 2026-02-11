# Connection Directory

This directory contains WebSocket client implementation.

## Structure

```
connection/
├── client.ts            # WebSocket client
├── reconnect.ts         # Reconnection logic
├── heartbeat.ts         # Heartbeat management
└── handlers.ts          # Message handlers
```

## Component Descriptions

### client.ts
WebSocket client implementation.

**Responsibilities:**
- Create WebSocket connection
- Handle connection lifecycle
- Send messages to backend
- Receive and dispatch messages
- Handle connection errors

**Events:**
- `open` - Connection established
- `close` - Connection closed
- `error` - Connection error
- `message` - Message received

### reconnect.ts
Reconnection strategy.

**Responsibilities:**
- Track connection state
- Implement exponential backoff
- Limit reconnection attempts
- Handle permanent failure

**Configuration:**
- Initial delay
- Max delay
- Backoff multiplier
- Max attempts

### heartbeat.ts
Heartbeat management.

**Responsibilities:**
- Send periodic ping
- Handle pong response
- Detect connection loss
- Trigger reconnection

**Configuration:**
- Heartbeat interval
- Timeout threshold

### handlers.ts
Message handlers.

**Handlers:**
- `authenticated` - Handle auth success
- `command:simulate` - Handle simulation request
- `command:execute` - Handle execution request
- `command:cancel` - Handle cancellation
- `ping` - Handle ping request
