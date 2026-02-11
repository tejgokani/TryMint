# Backend Controllers

> HTTP request handlers

## Purpose

Controllers handle HTTP requests, delegate to services, and format responses. They contain no business logic—only request/response handling.

## File Map

| File | Purpose |
|------|---------|
| `authController.js` | Authentication request handlers |
| `sessionController.js` | Session management handlers |
| `commandController.js` | Command submission handlers |
| `agentController.js` | Agent management handlers |
| `index.js` | Barrel export |

## Controller Responsibilities

### authController.js
| Handler | Route | Purpose |
|---------|-------|---------|
| `initiateOAuth` | POST /auth/google | Start OAuth flow |
| `handleCallback` | GET /auth/callback | Process OAuth callback |
| `logout` | POST /auth/logout | Terminate session |
| `getMe` | GET /auth/me | Get current user |

### sessionController.js
| Handler | Route | Purpose |
|---------|-------|---------|
| `create` | POST /session | Create new session |
| `getStatus` | GET /session | Get session status |
| `refresh` | POST /session/refresh | Refresh credentials |
| `terminate` | DELETE /session | End session |

### commandController.js
| Handler | Route | Purpose |
|---------|-------|---------|
| `simulate` | POST /command/simulate | Submit for simulation |
| `execute` | POST /command/execute | Execute command |
| `getHistory` | GET /command/history | Fetch history |
| `cancel` | DELETE /command/:id | Cancel command |

### agentController.js
| Handler | Route | Purpose |
|---------|-------|---------|
| `connect` | POST /agent/connect | Register agent |
| `heartbeat` | POST /agent/heartbeat | Heartbeat update |
| `disconnect` | POST /agent/disconnect | Unregister agent |

## Pattern

```javascript
// Controller pattern (pseudocode)
async function handler(req, res, next) {
  try {
    const result = await service.doSomething(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
```
