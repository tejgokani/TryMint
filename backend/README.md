# Backend

> TRYMINT API Server

---

## 📋 Overview

The backend package provides the API server for TRYMINT. Built with Node.js/Express, it handles authentication, session management, WebSocket connections, and serves as the bridge between the frontend and connected agents.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│  Routes          │  HTTP route handlers                 │
│  Controllers     │  Request/response logic              │
│  Services        │  Business logic                      │
│  Middleware      │  Request processing pipeline         │
│  WebSocket       │  Real-time connection handling       │
│  Models          │  Data structures                     │
│  Utils           │  Helper functions                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
backend/
├── src/
│   ├── routes/              # HTTP route definitions
│   │   ├── auth.ts          # Authentication routes
│   │   ├── session.ts       # Session management routes
│   │   ├── command.ts       # Command routes
│   │   └── index.ts         # Route aggregation
│   ├── controllers/         # Route handlers
│   │   ├── auth.ts          # Auth controller
│   │   ├── session.ts       # Session controller
│   │   └── command.ts       # Command controller
│   ├── services/            # Business logic
│   │   ├── auth.ts          # Authentication service
│   │   ├── session.ts       # Session management
│   │   ├── oauth.ts         # Google OAuth integration
│   │   └── command.ts       # Command routing
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication middleware
│   │   ├── session.ts       # Session validation
│   │   ├── rateLimit.ts     # Rate limiting
│   │   ├── validation.ts    # Request validation
│   │   ├── errorHandler.ts  # Error handling
│   │   └── logging.ts       # Request logging
│   ├── websocket/           # WebSocket handling
│   │   ├── server.ts        # WebSocket server setup
│   │   ├── handlers/        # Message handlers
│   │   │   ├── session.ts   # Session events
│   │   │   ├── command.ts   # Command events
│   │   │   ├── simulation.ts# Simulation events
│   │   │   └── terminal.ts  # Terminal events
│   │   ├── channels/        # Channel management
│   │   │   ├── agent.ts     # Agent connections
│   │   │   └── client.ts    # Frontend connections
│   │   └── protocol.ts      # Message protocol
│   ├── models/              # Data models
│   │   ├── user.ts          # User model
│   │   ├── session.ts       # Session model
│   │   └── command.ts       # Command model
│   ├── types/               # TypeScript definitions
│   │   ├── auth.ts          # Auth types
│   │   ├── session.ts       # Session types
│   │   ├── websocket.ts     # WebSocket types
│   │   └── index.ts         # Type exports
│   ├── utils/               # Utility functions
│   │   ├── crypto.ts        # Cryptographic utilities
│   │   ├── validation.ts    # Validation helpers
│   │   ├── logger.ts        # Logging utility
│   │   └── constants.ts     # Application constants
│   ├── config/              # Configuration
│   │   ├── index.ts         # Config aggregation
│   │   ├── oauth.ts         # OAuth configuration
│   │   ├── session.ts       # Session configuration
│   │   └── security.ts      # Security configuration
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🔑 Key Responsibilities

### Authentication
- Handle Google OAuth flow
- Validate OAuth tokens
- Issue session credentials
- Manage token refresh
- Handle logout/teardown

### Session Management
- Generate short-lived sessions
- Track session expiration
- Handle session refresh
- Enforce session limits
- Clean up expired sessions

### WebSocket Gateway
- Accept frontend connections
- Accept agent connections
- Route messages between parties
- Handle connection lifecycle
- Implement heartbeat mechanism

### Command Routing
- Receive commands from frontend
- Forward to appropriate agent
- Route simulation results
- Handle approval flow
- Stream execution output

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout and teardown

### Sessions
- `GET /session/current` - Get current session
- `GET /session/status` - Session status check
- `POST /session/refresh` - Refresh session
- `GET /session/agent-token` - Get agent credentials

### Commands
- `GET /commands/history` - Command history
- `GET /commands/:id` - Specific command details

---

## 🔌 WebSocket Protocol

### Client Events (Frontend → Backend)
- `authenticate` - Authenticate connection
- `command:simulate` - Request simulation
- `command:approve` - Approve execution
- `command:reject` - Reject execution
- `ping` - Keepalive

### Agent Events (Agent → Backend)
- `agent:authenticate` - Agent authentication
- `simulation:result` - Simulation complete
- `terminal:output` - Execution output
- `agent:status` - Status update

### Server Events (Backend → Clients)
- `session:connected` - Connection confirmed
- `session:expiring` - Expiration warning
- `simulation:result` - Forward results
- `terminal:output` - Forward output

---

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

---

## 📄 Configuration

See `.env.example` in the root directory for required environment variables.
