# Component Descriptions

> Detailed Component Documentation

---

## 📋 Overview

This document provides detailed descriptions of each major component in the TRYMINT system.

---

## 🖥️ Frontend

### Purpose
The frontend provides the web-based user interface for TRYMINT, enabling users to authenticate, submit commands, review simulations, and approve executions.

### Responsibilities
| Responsibility | Description |
|---------------|-------------|
| Authentication | Initiate OAuth login, display auth state |
| Command Input | Accept user command input |
| Simulation Display | Render simulation results |
| Approval Flow | Present approval interface |
| Session Display | Show session status and expiration |
| Terminal View | Display PTY output stream |

### Key Modules
- **App Router** - Page routing and navigation
- **Auth Components** - Login/logout UI
- **Command Components** - Command input and history
- **Simulation Components** - Result visualization
- **Terminal Components** - Output display

### External Interfaces
- REST API (HTTPS)
- WebSocket (WSS)

---

## 🖧 Backend

### Purpose
The backend provides the API server and WebSocket gateway, managing authentication, sessions, and routing between frontend and agents.

### Responsibilities
| Responsibility | Description |
|---------------|-------------|
| OAuth Integration | Handle Google OAuth flow |
| Session Management | Create, validate, refresh sessions |
| WebSocket Gateway | Manage real-time connections |
| Command Routing | Route commands to agents |
| Credential Generation | Create agent credentials |

### Key Modules
- **Auth Service** - OAuth and token management
- **Session Service** - Session lifecycle
- **WebSocket Server** - Real-time messaging
- **Command Router** - Message routing

### External Interfaces
- Google OAuth API
- Frontend (REST + WebSocket)
- Agent (WebSocket)

---

## 🤖 Agent

### Purpose
The agent is a local CLI daemon that executes commands on the user's machine, enforcing security boundaries and streaming output.

### Responsibilities
| Responsibility | Description |
|---------------|-------------|
| Command Simulation | Simulate commands before execution |
| PTY Execution | Execute commands via node-pty |
| Directory Isolation | Enforce capability boundaries |
| Output Streaming | Stream execution output |
| Credential Management | Store and refresh credentials |

### Key Modules
- **CLI Interface** - Command-line commands
- **WebSocket Client** - Backend connection
- **Simulation Engine** - Command simulation
- **PTY Manager** - Terminal execution
- **Isolation Layer** - Directory enforcement

### External Interfaces
- Backend (WebSocket)
- Local filesystem
- Local shell

---

## 🔄 Component Interaction Matrix

| From/To | Frontend | Backend | Agent |
|---------|----------|---------|-------|
| **Frontend** | - | REST, WS | - |
| **Backend** | REST, WS | - | WS |
| **Agent** | - | WS | - |

---

## 📊 Component Scaling

### Frontend
- Static deployment (CDN)
- Client-side only
- No server resources

### Backend
- Single instance (hackathon)
- In-memory session store
- Stateful WebSocket connections

### Agent
- One per user machine
- Local resources only
- No external scaling

---

## 🔗 Related Documents

- [Architecture Overview](overview.md)
- [Data Flow Diagrams](data-flow.md)
