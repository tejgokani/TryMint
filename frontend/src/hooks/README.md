# Hooks Directory

This directory contains custom React hooks for shared logic.

## Structure

```
hooks/
├── useAuth.ts           # Authentication state and methods
├── useSession.ts        # Session lifecycle management
├── useWebSocket.ts      # WebSocket connection management
├── useCommand.ts        # Command submission and tracking
├── useSimulation.ts     # Simulation result handling
├── useApproval.ts       # Approval workflow state
├── useTerminal.ts       # Terminal output streaming
└── index.ts             # Hook exports
```

## Hook Descriptions

### useAuth
- Access current authentication state
- Get user profile information
- Trigger login/logout flows
- Check authentication status

### useSession
- Get current session details
- Monitor session expiration
- Handle session refresh
- Check session validity

### useWebSocket
- Establish WebSocket connection
- Send/receive messages
- Handle reconnection
- Monitor connection state

### useCommand
- Submit commands for simulation
- Track command execution status
- Access command history
- Handle command cancellation

### useSimulation
- Receive simulation results
- Parse simulation output
- Track simulation status
- Handle simulation errors

### useApproval
- Submit approval/rejection
- Track approval status
- Handle approval timeout
- Access approval history

### useTerminal
- Subscribe to PTY output
- Handle output buffering
- Manage terminal resize
- Clear terminal state
