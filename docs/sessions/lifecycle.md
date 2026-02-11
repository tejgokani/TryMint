# Session Lifecycle

> Complete session lifecycle documentation

## Session Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SESSION LIFECYCLE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. USER LOGIN (Google OAuth)                                               │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │  Frontend   │──── OAuth Redirect ────►  Google                          │
│  └─────────────┘◄─── Auth Code ──────────────┘                             │
│         │                                                                   │
│         │ Auth Code                                                         │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │   Backend   │──── Exchange Code ─────►  Google                          │
│  └─────────────┘◄─── Access Token ───────────┘                             │
│         │                                                                   │
│         │ Session Created                                                   │
│         ▼                                                                   │
│  2. SESSION ACTIVE                                                          │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐    Session Token    ┌─────────────┐                       │
│  │  Frontend   │◄───────────────────►│   Backend   │                       │
│  └─────────────┘                     └─────────────┘                       │
│         │                                   │                               │
│         │ User connects agent               │                               │
│         ▼                                   ▼                               │
│  3. AGENT BINDING                                                           │
│                                                                             │
│  ┌─────────────┐    trymint connect  ┌─────────────┐                       │
│  │    Agent    │─────────────────────►│   Backend   │                       │
│  └─────────────┘◄────────────────────└─────────────┘                       │
│         │         Credentials +                                             │
│         │         Capabilities                                              │
│         │                                                                   │
│  4. COMMAND WORKFLOW                                                        │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   SIMULATE ───► PREVIEW ───► APPROVE ───► EXECUTE ───► COMPLETE    │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  5. SESSION END                                                             │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │   Logout    │                                                            │
│  └─────────────┘                                                            │
│         │                                                                   │
│         ├──── Revoke Credentials                                            │
│         ├──── Disconnect Agent                                              │
│         ├──── Clear Session                                                 │
│         └──── Redirect to Login                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Session States

| State | Description |
|-------|-------------|
| `CREATED` | Session initialized, awaiting agent |
| `ACTIVE` | Agent connected, ready for commands |
| `EXPIRING` | Credentials near expiry, refresh available |
| `EXPIRED` | Session timed out, re-auth required |
| `TERMINATED` | User logged out, cleanup complete |

## Credential Lifecycle

```
Generate ───► Active ───► Expiring ───► Expired
                │              │
                │   Refresh    │
                └──────────────┘
```

- **TTL**: 15 minutes
- **Refresh Window**: Last 5 minutes before expiry
- **Auto-refresh**: Agent can request refresh
- **Revocation**: Immediate on logout

## Mandatory Teardown

When a session ends (logout or expiry):

1. **Backend**
   - Invalidate session token
   - Revoke all credentials
   - Send terminate message to agent
   - Clear session data

2. **Frontend**
   - Clear local state
   - Close WebSocket
   - Redirect to login

3. **Agent**
   - Kill running processes
   - Clear stored credentials
   - Close WebSocket
   - Exit cleanly

## Timeout Values

| Timeout | Value | Description |
|---------|-------|-------------|
| Session | 2 hours | Maximum session duration |
| Credential | 15 min | Credential validity |
| Idle | 30 min | Inactivity timeout |
| Agent Heartbeat | 60 sec | Agent liveness check |
