# Architecture Overview

> High-level system architecture for TRYMINT

## System Context

TRYMINT is a three-tier architecture connecting a web frontend, backend server, and local CLI agent.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│                              ┌─────────────┐                                │
│                              │   Google    │                                │
│                              │   OAuth     │                                │
│                              └──────┬──────┘                                │
│                                     │                                       │
│                                     ▼                                       │
│  ┌─────────────┐   HTTPS    ┌─────────────┐    WSS     ┌─────────────┐     │
│  │             │◄──────────►│             │◄──────────►│             │     │
│  │  Frontend   │            │   Backend   │            │    Agent    │     │
│  │  (Browser)  │            │  (Node.js)  │            │   (Local)   │     │
│  │             │◄──────────►│             │            │             │     │
│  └─────────────┘    WSS     └─────────────┘            └──────┬──────┘     │
│                                     │                         │            │
│                                     ▼                         ▼            │
│                              ┌─────────────┐           ┌─────────────┐     │
│                              │  Session    │           │    PTY      │     │
│                              │   Store     │           │  Execution  │     │
│                              └─────────────┘           └─────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### Frontend
- User interface and experience
- Google OAuth authentication flow
- Real-time WebSocket communication
- Command input and history
- Simulation preview display
- Approval workflow
- Execution output display

### Backend
- REST API server
- WebSocket server
- OAuth token exchange
- Session management
- Credential generation
- Message routing (Frontend ↔ Agent)
- Rate limiting and validation

### Agent
- Local CLI tool
- WebSocket client to backend
- Command simulation
- PTY execution (node-pty)
- Directory capability enforcement
- Output streaming
- Credential management

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Redux, WebSocket |
| Backend | Node.js, Express, ws |
| Agent | Node.js, Commander, node-pty |
| Auth | Google OAuth 2.0 |
| Transport | HTTPS, WSS |

## Design Principles

1. **Security First** - Every command goes through simulation and approval
2. **Real-time** - WebSocket for instant feedback
3. **Stateless Backend** - Sessions stored externally, backend horizontally scalable
4. **Local Execution** - Commands run on user's machine, not server
5. **Short-lived Credentials** - Minimize attack window
6. **Capability-based Isolation** - Principle of least privilege
