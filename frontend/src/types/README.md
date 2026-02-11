# Types Directory

This directory contains TypeScript type definitions and interfaces.

## Structure

```
types/
├── auth.ts              # Authentication types
├── session.ts           # Session types
├── command.ts           # Command types
├── simulation.ts        # Simulation types
├── websocket.ts         # WebSocket message types
├── api.ts               # API request/response types
└── index.ts             # Type exports
```

## Type Categories

### auth.ts
Authentication and user type definitions.

- `User` - User profile interface
- `AuthState` - Authentication state
- `OAuthResponse` - OAuth callback data
- `TokenPair` - Access/refresh tokens
- `LoginRequest` - Login parameters
- `LogoutRequest` - Logout parameters

### session.ts
Session management types.

- `Session` - Session object
- `SessionCredentials` - Agent credentials
- `SessionCapabilities` - Allowed operations
- `SessionStatus` - Status enumeration
- `SessionConfig` - Session configuration

### command.ts
Command execution types.

- `Command` - Command object
- `CommandStatus` - Execution status enum
- `CommandResult` - Execution result
- `CommandHistory` - History entry
- `CommandInput` - Input parameters

### simulation.ts
Simulation types.

- `SimulationResult` - Result object
- `SimulationStatus` - Status enumeration
- `RiskLevel` - Risk assessment enum
- `AffectedResource` - Resource impact
- `SimulationDiff` - Before/after diff

### websocket.ts
WebSocket protocol types.

- `WSMessage` - Base message type
- `WSEvent` - Event type enumeration
- `SessionMessage` - Session events
- `CommandMessage` - Command events
- `SimulationMessage` - Simulation events
- `TerminalMessage` - Terminal output
