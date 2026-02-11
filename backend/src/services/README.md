# Backend Services

> Business logic layer

## Purpose

Services contain the core business logic of the application. They are called by controllers and interact with models. Services are stateless and testable.

## File Map

| File | Purpose |
|------|---------|
| `authService.js` | OAuth and authentication logic |
| `sessionService.js` | Session lifecycle management |
| `commandService.js` | Command processing logic |
| `credentialService.js` | Credential generation and validation |
| `agentService.js` | Agent communication and management |
| `index.js` | Barrel export |

## Service Responsibilities

### authService.js
| Method | Purpose |
|--------|---------|
| `generateOAuthUrl()` | Create OAuth redirect URL |
| `exchangeCode(code)` | Exchange auth code for tokens |
| `verifyToken(token)` | Validate OAuth/JWT token |
| `getUserInfo(token)` | Fetch user profile |
| `revokeToken(token)` | Revoke OAuth token |

### sessionService.js
| Method | Purpose |
|--------|---------|
| `create(userId)` | Create new session |
| `get(sessionId)` | Retrieve session |
| `refresh(sessionId)` | Refresh session credentials |
| `terminate(sessionId)` | End session with cleanup |
| `bindAgent(sessionId, agentId)` | Bind agent to session |
| `cleanup()` | Remove expired sessions |

### commandService.js
| Method | Purpose |
|--------|---------|
| `submit(sessionId, command)` | Submit command |
| `simulate(commandId)` | Request simulation |
| `approve(commandId)` | Mark approved |
| `execute(commandId)` | Request execution |
| `cancel(commandId)` | Cancel command |
| `getHistory(sessionId)` | Get command history |

### credentialService.js
| Method | Purpose |
|--------|---------|
| `generate(sessionId, capabilities)` | Create credential |
| `validate(credential)` | Validate credential |
| `refresh(credentialId)` | Refresh credential |
| `revoke(credentialId)` | Revoke credential |
| `checkCapability(credential, path)` | Check path access |

### agentService.js
| Method | Purpose |
|--------|---------|
| `register(agentInfo)` | Register new agent |
| `heartbeat(agentId)` | Update heartbeat |
| `sendCommand(agentId, command)` | Send to agent |
| `disconnect(agentId)` | Disconnect agent |
| `getStatus(agentId)` | Get agent status |

## Service Dependencies

```
authService
    ↓
sessionService ←→ credentialService
    ↓
commandService ←→ agentService
```
