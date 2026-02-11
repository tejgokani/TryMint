# TRYMINT – Try Before You Mint

> A secure simulation-first command execution platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Status](https://img.shields.io/badge/status-development-orange.svg)]()

---

## 📋 Overview

TRYMINT is a secure command execution platform that enforces a **Simulation → Approval → Execution** workflow. Users authenticate via Google OAuth, receive short-lived session credentials, and interact with a local agent CLI that streams commands through PTY with directory capability-based isolation.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              (React/Next.js Web Application)                     │
│         Google OAuth • Session Display • Approval UI             │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS / WSS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
│                    (Node.js API Server)                          │
│     Auth Service • Session Manager • WebSocket Gateway           │
└─────────────────────────────┬───────────────────────────────────┘
                              │ WebSocket (Secure Channel)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           AGENT                                  │
│                    (Local CLI Daemon)                            │
│   PTY Streaming • Simulation Engine • Directory Isolation        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Core Security Principles

1. **Simulation-First**: All commands are simulated before execution
2. **Explicit Approval**: User must approve simulated results
3. **Short-Lived Sessions**: Credentials expire automatically
4. **Directory Isolation**: Capability-based filesystem access
5. **Mandatory Teardown**: Logout clears all active sessions

---

## 📁 Repository Structure

```
trymint/
├── frontend/          # Web application (React/Next.js)
├── backend/           # API server (Node.js/Express)
├── agent/             # Local CLI agent (Node.js/node-pty)
├── docs/              # Project documentation
├── .gitignore         # Git ignore rules
├── package.json       # Workspace configuration
└── README.md          # This file
```

---

## 🚀 Quick Start

See [docs/setup/](docs/setup/) for detailed setup instructions.

### Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Google OAuth credentials
- macOS/Linux environment

### Development

```bash
# Clone repository
git clone <repository-url>
cd trymint

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env

# Start development
pnpm dev
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture Overview](docs/architecture/) | System design and component interaction |
| [Security Model](docs/security/) | Security boundaries and threat model |
| [API Reference](docs/api/) | REST API documentation |
| [WebSocket Protocol](docs/websocket/) | Real-time communication protocol |
| [Agent Guide](docs/agent/) | Local agent setup and usage |
| [Session Lifecycle](docs/sessions/) | Session management documentation |

---

## 🔄 Workflow

```
1. USER authenticates via Google OAuth
           ↓
2. BACKEND issues short-lived session token
           ↓
3. AGENT connects with session credentials
           ↓
4. USER submits command for simulation
           ↓
5. AGENT simulates command in isolated environment
           ↓
6. FRONTEND displays simulation results
           ↓
7. USER approves or rejects execution
           ↓
8. AGENT executes approved command via PTY
           ↓
9. LOGOUT triggers mandatory session teardown
```

---

## 🧩 Components

### Frontend
- Google OAuth login flow
- Real-time command streaming display
- Simulation result visualization
- Approval/rejection interface
- Session management UI

### Backend
- OAuth token validation
- Session credential generation
- WebSocket connection management
- Command routing and logging
- Session lifecycle management

### Agent
- Local PTY command execution
- Simulation engine
- Directory capability enforcement
- WebSocket client connection
- Secure credential storage

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 👥 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
