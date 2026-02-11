# Store Directory

> Redux state management configuration

## Purpose

This directory contains Redux store configuration and state slices for managing application state.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Store configuration and export |
| `authSlice.js` | Authentication state |
| `sessionSlice.js` | Session state |
| `commandSlice.js` | Command state |
| `simulationSlice.js` | Simulation state |
| `executionSlice.js` | Execution state |

## State Shape

```javascript
{
  auth: {
    user: null | UserObject,
    isAuthenticated: boolean,
    loading: boolean,
    error: null | string
  },
  
  session: {
    id: null | string,
    status: 'idle' | 'connecting' | 'active' | 'expired',
    credentials: null | CredentialsObject,
    expiresAt: null | timestamp,
    agentConnected: boolean
  },
  
  command: {
    current: null | string,
    history: CommandObject[],
    queue: CommandObject[]
  },
  
  simulation: {
    status: 'idle' | 'running' | 'completed' | 'failed',
    result: null | SimulationResult,
    warnings: WarningObject[]
  },
  
  execution: {
    status: 'idle' | 'running' | 'completed' | 'failed',
    output: string[],
    exitCode: null | number
  }
}
```

## Slice Responsibilities

### authSlice
- User login/logout
- Token storage
- Auth error handling

### sessionSlice
- Session lifecycle
- Credential management
- Agent connection state

### commandSlice
- Current command
- Command history
- Command queue

### simulationSlice
- Simulation status
- Simulation results
- Warning management

### executionSlice
- Execution status
- Output buffering
- Exit code tracking
