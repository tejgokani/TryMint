# TRYMINT Directory Structure

> Complete Project Tree

```
trymint/
├── README.md                           # Project overview and quick start
├── CONTRIBUTING.md                     # Contribution guidelines
├── package.json                        # Workspace configuration (pnpm)
├── .gitignore                          # Git ignore rules
├── .env.example                        # Environment template
│
├── frontend/                           # Web Application
│   ├── README.md                       # Frontend documentation
│   ├── package.json                    # Frontend package config
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── next.config.js                  # Next.js configuration
│   ├── tailwind.config.js              # Tailwind CSS configuration
│   ├── public/                         # Static assets
│   │   ├── icons/                      # Application icons
│   │   └── images/                     # Static images
│   └── src/
│       ├── app/                        # Next.js App Router
│       │   ├── README.md               # App directory docs
│       │   ├── layout.tsx              # Root layout
│       │   ├── page.tsx                # Landing page
│       │   ├── loading.tsx             # Global loading
│       │   ├── error.tsx               # Global error
│       │   ├── not-found.tsx           # 404 page
│       │   ├── (auth)/                 # Auth route group
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   ├── callback/
│       │   │   │   └── page.tsx
│       │   │   └── logout/
│       │   │       └── page.tsx
│       │   └── (dashboard)/            # Dashboard route group
│       │       ├── layout.tsx
│       │       ├── page.tsx
│       │       ├── commands/
│       │       │   └── page.tsx
│       │       ├── sessions/
│       │       │   └── page.tsx
│       │       └── settings/
│       │           └── page.tsx
│       ├── components/                 # React components
│       │   ├── README.md               # Components docs
│       │   ├── auth/
│       │   │   ├── LoginButton.tsx
│       │   │   ├── LogoutButton.tsx
│       │   │   ├── AuthGuard.tsx
│       │   │   └── SessionExpiry.tsx
│       │   ├── command/
│       │   │   ├── CommandInput.tsx
│       │   │   ├── CommandHistory.tsx
│       │   │   ├── CommandStatus.tsx
│       │   │   └── CommandCard.tsx
│       │   ├── simulation/
│       │   │   ├── SimulationPanel.tsx
│       │   │   ├── SimulationDiff.tsx
│       │   │   ├── RiskIndicator.tsx
│       │   │   └── AffectedFiles.tsx
│       │   ├── approval/
│       │   │   ├── ApprovalModal.tsx
│       │   │   ├── ApprovalButtons.tsx
│       │   │   └── ApprovalHistory.tsx
│       │   ├── session/
│       │   │   ├── SessionCard.tsx
│       │   │   ├── SessionList.tsx
│       │   │   ├── SessionTimer.tsx
│       │   │   └── AgentStatus.tsx
│       │   ├── terminal/
│       │   │   ├── TerminalWindow.tsx
│       │   │   ├── TerminalHeader.tsx
│       │   │   └── OutputStream.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Modal.tsx
│       │       ├── Card.tsx
│       │       ├── Badge.tsx
│       │       ├── Spinner.tsx
│       │       ├── Toast.tsx
│       │       └── index.ts
│       ├── hooks/                      # Custom React hooks
│       │   ├── README.md
│       │   ├── useAuth.ts
│       │   ├── useSession.ts
│       │   ├── useWebSocket.ts
│       │   ├── useCommand.ts
│       │   ├── useSimulation.ts
│       │   ├── useApproval.ts
│       │   ├── useTerminal.ts
│       │   └── index.ts
│       ├── services/                   # API clients
│       │   ├── README.md
│       │   ├── api.ts
│       │   ├── websocket.ts
│       │   ├── auth.ts
│       │   └── index.ts
│       ├── store/                      # State management
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   ├── simulation.ts
│       │   ├── terminal.ts
│       │   ├── notifications.ts
│       │   └── index.ts
│       ├── types/                      # TypeScript types
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   ├── simulation.ts
│       │   ├── websocket.ts
│       │   ├── api.ts
│       │   └── index.ts
│       ├── utils/                      # Utilities
│       │   ├── README.md
│       │   ├── validation.ts
│       │   ├── formatting.ts
│       │   ├── constants.ts
│       │   ├── crypto.ts
│       │   ├── storage.ts
│       │   ├── time.ts
│       │   └── index.ts
│       └── styles/
│           └── globals.css
│
├── backend/                            # API Server
│   ├── README.md                       # Backend documentation
│   ├── package.json                    # Backend package config
│   ├── tsconfig.json                   # TypeScript configuration
│   └── src/
│       ├── app.ts                      # Express app setup
│       ├── server.ts                   # Server entry point
│       ├── routes/                     # HTTP routes
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   ├── health.ts
│       │   └── index.ts
│       ├── controllers/                # Route handlers
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   └── health.ts
│       ├── services/                   # Business logic
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── oauth.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   ├── credential.ts
│       │   └── index.ts
│       ├── middleware/                 # Express middleware
│       │   ├── README.md
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── rateLimit.ts
│       │   ├── validation.ts
│       │   ├── errorHandler.ts
│       │   ├── logging.ts
│       │   ├── cors.ts
│       │   ├── security.ts
│       │   └── index.ts
│       ├── websocket/                  # WebSocket server
│       │   ├── README.md
│       │   ├── server.ts
│       │   ├── protocol.ts
│       │   ├── handlers/
│       │   │   ├── session.ts
│       │   │   ├── command.ts
│       │   │   ├── simulation.ts
│       │   │   ├── terminal.ts
│       │   │   └── index.ts
│       │   └── channels/
│       │       ├── agent.ts
│       │       ├── client.ts
│       │       └── index.ts
│       ├── models/                     # Data models
│       │   ├── README.md
│       │   ├── user.ts
│       │   ├── session.ts
│       │   ├── command.ts
│       │   ├── credential.ts
│       │   └── index.ts
│       ├── types/                      # TypeScript types
│       │   ├── auth.ts
│       │   ├── session.ts
│       │   ├── websocket.ts
│       │   └── index.ts
│       ├── config/                     # Configuration
│       │   ├── README.md
│       │   ├── index.ts
│       │   ├── oauth.ts
│       │   ├── session.ts
│       │   ├── security.ts
│       │   ├── websocket.ts
│       │   └── logging.ts
│       └── utils/                      # Utilities
│           ├── README.md
│           ├── crypto.ts
│           ├── validation.ts
│           ├── logger.ts
│           ├── constants.ts
│           ├── errors.ts
│           └── index.ts
│
├── agent/                              # Local CLI Agent
│   ├── README.md                       # Agent documentation
│   ├── package.json                    # Agent package config
│   ├── tsconfig.json                   # TypeScript configuration
│   └── src/
│       ├── index.ts                    # Main entry point
│       ├── cli/                        # CLI interface
│       │   ├── README.md
│       │   ├── index.ts
│       │   ├── prompts.ts
│       │   └── commands/
│       │       ├── connect.ts
│       │       ├── disconnect.ts
│       │       ├── status.ts
│       │       └── config.ts
│       ├── connection/                 # WebSocket client
│       │   ├── README.md
│       │   ├── client.ts
│       │   ├── reconnect.ts
│       │   ├── heartbeat.ts
│       │   └── handlers.ts
│       ├── simulation/                 # Simulation engine
│       │   ├── README.md
│       │   ├── engine.ts
│       │   ├── sandbox.ts
│       │   ├── analyzer.ts
│       │   └── risk.ts
│       ├── execution/                  # PTY execution
│       │   ├── README.md
│       │   ├── pty.ts
│       │   ├── executor.ts
│       │   ├── stream.ts
│       │   └── cleanup.ts
│       ├── isolation/                  # Directory isolation
│       │   ├── README.md
│       │   ├── capabilities.ts
│       │   ├── validator.ts
│       │   └── sandbox.ts
│       ├── credentials/                # Credential management
│       │   ├── README.md
│       │   ├── store.ts
│       │   ├── secure.ts
│       │   └── refresh.ts
│       ├── types/                      # TypeScript types
│       │   ├── command.ts
│       │   ├── simulation.ts
│       │   ├── websocket.ts
│       │   └── index.ts
│       └── utils/                      # Utilities
│           ├── logger.ts
│           ├── config.ts
│           └── constants.ts
│
└── docs/                               # Documentation
    ├── README.md                       # Documentation index
    ├── architecture/                   # Architecture docs
    │   ├── overview.md
    │   ├── components.md
    │   ├── data-flow.md
    │   └── decisions.md
    ├── security/                       # Security docs
    │   ├── model.md
    │   ├── boundaries.md
    │   ├── threats.md
    │   └── credentials.md
    ├── api/                            # API docs
    │   ├── overview.md
    │   ├── authentication.md
    │   ├── sessions.md
    │   └── commands.md
    ├── websocket/                      # WebSocket docs
    │   ├── protocol.md
    │   ├── events.md
    │   └── messages.md
    ├── agent/                          # Agent docs
    │   ├── overview.md
    │   ├── installation.md
    │   ├── configuration.md
    │   └── commands.md
    ├── sessions/                       # Session docs
    │   ├── lifecycle.md
    │   ├── credentials.md
    │   └── teardown.md
    └── setup/                          # Setup docs
        ├── quickstart.md
        ├── development.md
        ├── production.md
        └── troubleshooting.md
```

---

## 📊 Structure Summary

| Package | Purpose | Key Files |
|---------|---------|-----------|
| `frontend/` | Web UI | React/Next.js app |
| `backend/` | API Server | Express + WebSocket |
| `agent/` | Local CLI | node-pty daemon |
| `docs/` | Documentation | Architecture, security, setup |

---

## 🔗 Related Documents

- [Architecture Overview](docs/architecture/overview.md)
- [Security Model](docs/security/model.md)
- [Quick Start](docs/setup/quickstart.md)
