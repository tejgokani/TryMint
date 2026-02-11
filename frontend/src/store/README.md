# Store Directory

This directory contains state management logic.

## Structure

```
store/
├── auth.ts              # Authentication state
├── session.ts           # Session state
├── command.ts           # Command state
├── simulation.ts        # Simulation state
├── terminal.ts          # Terminal output state
├── notifications.ts     # UI notifications state
└── index.ts             # Store configuration
```

## State Descriptions

### auth.ts
Authentication and user state.

**State Shape:**
- `isAuthenticated` - Boolean auth status
- `user` - User profile object
- `token` - Current access token
- `loading` - Auth loading state
- `error` - Auth error state

### session.ts
Active session state.

**State Shape:**
- `sessionId` - Current session ID
- `expiresAt` - Expiration timestamp
- `isExpired` - Expiration status
- `agentConnected` - Agent connection status
- `capabilities` - Allowed directories

### command.ts
Command execution state.

**State Shape:**
- `currentCommand` - Active command
- `history` - Command history
- `status` - Execution status
- `pending` - Awaiting approval

### simulation.ts
Simulation result state.

**State Shape:**
- `result` - Simulation output
- `riskLevel` - Assessed risk
- `affectedPaths` - Affected files
- `status` - Simulation status

### terminal.ts
Terminal output state.

**State Shape:**
- `buffer` - Output buffer
- `isStreaming` - Stream active
- `dimensions` - Terminal size
