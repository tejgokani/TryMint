# WebSocket Directory

This directory contains WebSocket server implementation.

## Structure

```
websocket/
├── server.ts            # WebSocket server setup
├── handlers/            # Message handlers
│   ├── session.ts       # Session event handlers
│   ├── command.ts       # Command event handlers
│   ├── simulation.ts    # Simulation event handlers
│   ├── terminal.ts      # Terminal event handlers
│   └── index.ts         # Handler exports
├── channels/            # Channel management
│   ├── agent.ts         # Agent channel
│   ├── client.ts        # Frontend client channel
│   └── index.ts         # Channel exports
├── protocol.ts          # Message protocol
└── README.md            # This file
```

## Component Descriptions

### server.ts
WebSocket server setup and lifecycle.

**Responsibilities:**
- Create WebSocket server
- Handle connection upgrade
- Manage connection lifecycle
- Implement heartbeat/ping-pong
- Route messages to handlers
- Handle disconnection

### handlers/

#### session.ts
Session-related event handlers.

**Events:**
- `authenticate` - Handle authentication
- `session:refresh` - Handle session refresh
- `session:teardown` - Handle logout teardown

#### command.ts
Command-related event handlers.

**Events:**
- `command:simulate` - Forward to agent
- `command:approve` - Forward approval
- `command:reject` - Forward rejection
- `command:cancel` - Cancel execution

#### simulation.ts
Simulation event handlers.

**Events:**
- `simulation:result` - Forward to client
- `simulation:error` - Forward error
- `simulation:progress` - Forward progress

#### terminal.ts
Terminal output handlers.

**Events:**
- `terminal:output` - Forward PTY output
- `terminal:resize` - Handle resize
- `terminal:clear` - Clear terminal

### channels/

#### agent.ts
Agent connection management.

**Responsibilities:**
- Track connected agents
- Route messages to agents
- Handle agent authentication
- Monitor agent health
- Handle agent disconnection

#### client.ts
Frontend client management.

**Responsibilities:**
- Track connected clients
- Route messages to clients
- Bind clients to sessions
- Handle client disconnection

### protocol.ts
Message protocol definition.

**Responsibilities:**
- Define message format
- Message serialization
- Message validation
- Error message format
