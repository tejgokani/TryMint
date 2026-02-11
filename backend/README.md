# Backend – TRYMINT API Server

> Node.js/Express API server with WebSocket support

## Purpose

The backend provides:
- REST API for authentication and session management
- WebSocket server for real-time communication
- Session and credential management
- Agent connection handling
- Command routing between frontend and agent

## Folder Structure

```
backend/
├── src/
│   ├── config/             # Configuration management
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # Route definitions
│   ├── services/           # Business logic
│   ├── types/              # Type definitions
│   ├── utils/              # Utility functions
│   ├── websocket/          # WebSocket handlers
│   └── index.js            # Application entry point
├── package.json            # Package configuration
└── README.md               # This file
```

## File Map

### `/src/config/`
| File | Purpose |
|------|---------|
| `index.js` | Configuration aggregator |
| `app.js` | App configuration |
| `auth.js` | OAuth configuration |
| `database.js` | Database configuration |
| `session.js` | Session configuration |
| `websocket.js` | WebSocket configuration |

### `/src/controllers/`
| File | Purpose |
|------|---------|
| `authController.js` | Authentication handlers |
| `sessionController.js` | Session management handlers |
| `commandController.js` | Command handling |
| `agentController.js` | Agent management |

### `/src/middleware/`
| File | Purpose |
|------|---------|
| `authenticate.js` | JWT/session verification |
| `authorize.js` | Permission checking |
| `validate.js` | Request validation |
| `rateLimit.js` | Rate limiting |
| `errorHandler.js` | Global error handler |
| `logger.js` | Request logging |

### `/src/models/`
| File | Purpose |
|------|---------|
| `User.js` | User data model |
| `Session.js` | Session data model |
| `Command.js` | Command data model |
| `Credential.js` | Credential data model |

### `/src/routes/`
| File | Purpose |
|------|---------|
| `index.js` | Route aggregator |
| `auth.js` | Auth routes |
| `session.js` | Session routes |
| `command.js` | Command routes |
| `agent.js` | Agent routes |
| `health.js` | Health check route |

### `/src/services/`
| File | Purpose |
|------|---------|
| `authService.js` | OAuth logic |
| `sessionService.js` | Session lifecycle |
| `commandService.js` | Command processing |
| `credentialService.js` | Credential management |
| `agentService.js` | Agent communication |

### `/src/types/`
| File | Purpose |
|------|---------|
| `auth.js` | Auth types |
| `session.js` | Session types |
| `command.js` | Command types |
| `websocket.js` | WebSocket types |

### `/src/utils/`
| File | Purpose |
|------|---------|
| `crypto.js` | Cryptographic helpers |
| `validators.js` | Validation helpers |
| `errors.js` | Custom error classes |
| `logger.js` | Logging utility |

### `/src/websocket/`
| File | Purpose |
|------|---------|
| `index.js` | WebSocket server setup |
| `handlers.js` | Message handlers |
| `channels.js` | Channel management |
| `broadcast.js` | Broadcasting utilities |

## API Routes

```
POST   /auth/google          # Initiate OAuth
GET    /auth/callback        # OAuth callback
POST   /auth/logout          # Logout with teardown
GET    /auth/me              # Current user info

POST   /session              # Create session
GET    /session              # Get session status
POST   /session/refresh      # Refresh credentials
DELETE /session              # Terminate session

POST   /command/simulate     # Submit for simulation
POST   /command/execute      # Execute approved command
GET    /command/history      # Get command history
DELETE /command/:id          # Cancel command

POST   /agent/connect        # Agent connection
POST   /agent/heartbeat      # Agent heartbeat
POST   /agent/disconnect     # Agent disconnect

GET    /health               # Health check
```

## WebSocket Events

### Server → Client
| Event | Purpose |
|-------|---------|
| `session:status` | Session state updates |
| `session:expiring` | Credential expiry warning |
| `simulation:started` | Simulation began |
| `simulation:result` | Simulation completed |
| `execution:started` | Execution began |
| `execution:output` | PTY output chunk |
| `execution:complete` | Execution finished |
| `agent:connected` | Agent online |
| `agent:disconnected` | Agent offline |

### Client → Server
| Event | Purpose |
|-------|---------|
| `command:submit` | Submit command |
| `execution:cancel` | Cancel execution |
| `session:refresh` | Refresh request |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐    ┌──────────────┐    ┌─────────────────┐     │
│  │ Routes  │───►│ Controllers  │───►│    Services     │     │
│  └─────────┘    └──────────────┘    └─────────────────┘     │
│       │                                      │              │
│       ▼                                      ▼              │
│  ┌─────────────┐                    ┌─────────────────┐     │
│  │ Middleware  │                    │     Models      │     │
│  └─────────────┘                    └─────────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              WebSocket Server                       │    │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────┐     │    │
│  │  │Handlers │  │ Channels │  │   Broadcast     │     │    │
│  │  └─────────┘  └──────────┘  └─────────────────┘     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Responsibilities

- OAuth token validation
- Session token generation and validation
- Short-lived credential management
- Agent authentication
- Rate limiting
- Input validation
- CORS configuration
