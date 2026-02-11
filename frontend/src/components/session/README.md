# Session Components

> UI components for session management and agent connection

## Purpose

These components display session state, credential timers, and agent connection status.

## File Map

| File | Purpose |
|------|---------|
| `SessionStatus.js` | Current session state display |
| `SessionTimer.js` | Credential expiry countdown |
| `AgentConnection.js` | Agent connection indicator |
| `SessionControls.js` | Session management actions |
| `index.js` | Barrel export for all components |

## Component Details

### SessionStatus
- Shows active/inactive state
- User identity display
- Session ID (truncated)
- Connected since timestamp

### SessionTimer
- Countdown to credential expiry
- Warning state near expiry
- Refresh action available
- Auto-logout on expiry

### AgentConnection
- Connected/disconnected indicator
- Agent version display
- Reconnection status
- Last heartbeat time

### SessionControls
- Refresh credentials button
- Disconnect agent button
- End session button
- Settings link

## Session States

```
INITIALIZING → CONNECTED → ACTIVE → EXPIRING → EXPIRED
                  ↓           ↓
            DISCONNECTED   LOGOUT
```
