# Backend Routes

> Express route definitions

## Purpose

Route files define API endpoints and connect them to controllers. Routes are organized by resource/feature.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Route aggregator and mounting |
| `auth.js` | Authentication routes |
| `session.js` | Session management routes |
| `command.js` | Command routes |
| `agent.js` | Agent routes |
| `health.js` | Health check route |

## Route Definitions

### auth.js
```
POST   /auth/google     → authController.initiateOAuth
GET    /auth/callback   → authController.handleCallback
POST   /auth/logout     → authController.logout
GET    /auth/me         → authController.getMe
```

### session.js
```
POST   /session         → sessionController.create
GET    /session         → sessionController.getStatus
POST   /session/refresh → sessionController.refresh
DELETE /session         → sessionController.terminate
```

### command.js
```
POST   /command/simulate → commandController.simulate
POST   /command/execute  → commandController.execute
GET    /command/history  → commandController.getHistory
DELETE /command/:id      → commandController.cancel
```

### agent.js
```
POST   /agent/connect    → agentController.connect
POST   /agent/heartbeat  → agentController.heartbeat
POST   /agent/disconnect → agentController.disconnect
```

### health.js
```
GET    /health           → { status: 'ok', timestamp }
```

## Route Mounting

```javascript
// index.js pattern
router.use('/auth', authRoutes);
router.use('/session', authenticate, sessionRoutes);
router.use('/command', authenticate, commandRoutes);
router.use('/agent', agentRoutes);
router.use('/health', healthRoutes);
```

## Middleware per Route

| Route | Middleware |
|-------|------------|
| /auth/* | rateLimit |
| /session/* | authenticate, rateLimit |
| /command/* | authenticate, validate |
| /agent/* | agentAuth, rateLimit |
| /health | none |
