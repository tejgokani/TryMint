# Hooks Directory

> Custom React hooks for state and logic encapsulation

## Purpose

This directory contains custom React hooks that encapsulate business logic, state management, and side effects. These hooks are used by components to access shared functionality.

## File Map

| File | Purpose |
|------|---------|
| `useAuth.js` | Authentication state and actions |
| `useSession.js` | Session management and state |
| `useWebSocket.js` | WebSocket connection management |
| `useSimulation.js` | Simulation state and actions |
| `useExecution.js` | Execution state and actions |
| `useApproval.js` | Approval workflow state |
| `useAgent.js` | Agent connection state |
| `useCredentials.js` | Credential lifecycle |
| `useTerminal.js` | Terminal output handling |
| `index.js` | Barrel export for all hooks |

## Hook Details

### useAuth
```
Returns: { user, isAuthenticated, login, logout, loading }
```

### useSession
```
Returns: { session, isActive, connect, disconnect, refresh }
```

### useWebSocket
```
Returns: { connected, send, subscribe, unsubscribe }
```

### useSimulation
```
Returns: { result, isSimulating, simulate, reset }
```

### useExecution
```
Returns: { output, status, execute, cancel }
```

### useApproval
```
Returns: { pending, approve, reject, skip }
```

### useAgent
```
Returns: { connected, version, lastHeartbeat }
```

### useCredentials
```
Returns: { credentials, expiresIn, refresh, isExpiring }
```

### useTerminal
```
Returns: { lines, append, clear, scroll }
```

## Usage Pattern

Hooks connect to:
1. Redux store (via useSelector/useDispatch)
2. WebSocket service (for real-time updates)
3. API service (for REST calls)
