# TRYMINT – Try Before You Mint

> A secure simulation-first command execution platform

## Overview

TRYMINT is a security-focused platform that enables users to **simulate**, **review**, and **approve** command executions before they are actually run on their local machines. The system provides a safe sandbox environment where commands are first simulated, then reviewed for approval, and only executed after explicit user consent

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TRYMINT PLATFORM                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐     WebSocket      ┌─────────────┐     WebSocket          │
│   │  Frontend   │◄──────────────────►│   Backend   │◄───────────────┐       │
│   │  (React)    │                    │  (Node.js)  │                │       │
│   └─────────────┘                    └─────────────┘                │       │
│         │                                   │                       │       │
│         │ Google OAuth                      │ Session Management    │       │
│         ▼                                   ▼                       │       │
│   ┌─────────────┐                    ┌─────────────┐         ┌──────┴────┐  │
│   │   Auth      │                    │  Credential │         │   Agent   │  │
│   │   Flow      │                    │   Store     │         │   (CLI)   │  │
│   └─────────────┘                    └─────────────┘         └───────────┘  │
│                                                                    │        │
│                                                              ┌─────▼─────┐  │
│                                                              │   PTY     │  │
│                                                              │ Execution │  │
│                                                              └───────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Core Workflow

```
1. SIMULATE  →  2. REVIEW  →  3. APPROVE  →  4. EXECUTE
     │              │              │              │
     ▼              ▼              ▼              ▼
  Sandbox       Preview        User OK       Real PTY
  Output        Changes        Required      Execution
```

## Monorepo Structure

```
trymint/
├── frontend/          # React web application
├── backend/           # Node.js API server
├── agent/             # Local CLI agent
├── docs/              # Project documentation
├── package.json       # Workspace configuration
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Key Features

- **Google OAuth Authentication** - Secure user authentication
- **Short-lived Session Credentials** - Time-bounded access tokens
- **WebSocket Communication** - Real-time bidirectional messaging
- **Simulation-First Execution** - All commands simulated before execution
- **Approval Workflow** - Explicit user approval required
- **Directory Isolation** - Capability-based access control
- **PTY Streaming** - Full terminal emulation via node-pty
- **Mandatory Logout Teardown** - Clean session termination

## Security Model

- All commands are sandboxed and simulated first
- No execution without explicit user approval
- Short-lived credentials with automatic expiry
- Directory-based capability isolation
- Session binding between agent and user
- Mandatory cleanup on session end

## Quick Start

See individual README files in each directory:

- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)
- [Agent Setup](./agent/README.md)
- [Documentation](./docs/README.md)

## Development

This project uses npm workspaces. See setup documentation for details.

## License

MIT License

---

**TRYMINT** – *Try Before You Mint*
