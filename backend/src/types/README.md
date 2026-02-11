# Types Directory

This directory contains TypeScript type definitions.

## Structure

```
types/
├── auth.ts              # Authentication types
├── session.ts           # Session types
├── command.ts           # Command types
├── websocket.ts         # WebSocket types
├── agent.ts             # Agent types
├── api.ts               # API types
└── index.ts             # Type exports
```

## Type Categories

### auth.ts
- `AuthToken` - JWT token structure
- `TokenPayload` - Token payload
- `OAuthTokens` - OAuth token pair
- `GoogleProfile` - Google user profile
- `AuthResult` - Authentication result

### session.ts
- `Session` - Session object
- `SessionConfig` - Session configuration
- `SessionCapabilities` - Allowed operations
- `SessionStatus` - Status enumeration

### command.ts
- `Command` - Command object
- `CommandStatus` - Status enumeration
- `CommandResult` - Execution result
- `SimulationResult` - Simulation output

### websocket.ts
- `WSMessage` - Base message type
- `WSEvent` - Event enumeration
- `WSConnection` - Connection metadata
- `WSError` - Error message

### agent.ts
- `Agent` - Agent metadata
- `AgentCredentials` - Agent auth
- `AgentCapabilities` - Agent capabilities
- `AgentStatus` - Status enumeration

### api.ts
- `ApiResponse` - Standard response
- `ApiError` - Error response
- `PaginatedResponse` - Paginated data
