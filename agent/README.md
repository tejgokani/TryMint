# Agent

> TRYMINT Local CLI Agent

---

## 📋 Overview

The agent package provides the local CLI daemon for TRYMINT. Built with Node.js and node-pty, it handles command simulation, PTY-based execution, directory capability enforcement, and secure communication with the backend.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      AGENT LAYER                         │
├─────────────────────────────────────────────────────────┤
│  CLI            │  Command-line interface               │
│  Connection     │  WebSocket client                     │
│  Simulation     │  Command simulation engine            │
│  Execution      │  PTY command execution                │
│  Isolation      │  Directory capability enforcement     │
│  Credentials    │  Secure credential storage            │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
agent/
├── src/
│   ├── cli/                 # CLI interface
│   │   ├── index.ts         # CLI entry point
│   │   ├── commands/        # CLI commands
│   │   │   ├── connect.ts   # Connect to backend
│   │   │   ├── disconnect.ts# Disconnect agent
│   │   │   ├── status.ts    # Show status
│   │   │   └── config.ts    # Configure agent
│   │   └── prompts.ts       # Interactive prompts
│   ├── connection/          # WebSocket client
│   │   ├── client.ts        # WebSocket client
│   │   ├── reconnect.ts     # Reconnection logic
│   │   ├── heartbeat.ts     # Heartbeat management
│   │   └── handlers.ts      # Message handlers
│   ├── simulation/          # Simulation engine
│   │   ├── engine.ts        # Simulation engine
│   │   ├── sandbox.ts       # Sandbox environment
│   │   ├── analyzer.ts      # Command analyzer
│   │   └── risk.ts          # Risk assessment
│   ├── execution/           # PTY execution
│   │   ├── pty.ts           # PTY manager
│   │   ├── executor.ts      # Command executor
│   │   ├── stream.ts        # Output streaming
│   │   └── cleanup.ts       # Execution cleanup
│   ├── isolation/           # Directory isolation
│   │   ├── capabilities.ts  # Capability management
│   │   ├── validator.ts     # Path validation
│   │   └── sandbox.ts       # Filesystem sandbox
│   ├── credentials/         # Credential management
│   │   ├── store.ts         # Credential storage
│   │   ├── secure.ts        # Secure storage
│   │   └── refresh.ts       # Credential refresh
│   ├── types/               # TypeScript definitions
│   │   ├── command.ts       # Command types
│   │   ├── simulation.ts    # Simulation types
│   │   ├── websocket.ts     # WebSocket types
│   │   └── index.ts         # Type exports
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Logging utility
│   │   ├── config.ts        # Configuration loader
│   │   └── constants.ts     # Constants
│   └── index.ts             # Main entry point
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## 🔑 Key Responsibilities

### CLI Interface
- Interactive setup and configuration
- Connection management commands
- Status display
- Credential handling

### WebSocket Connection
- Establish secure connection to backend
- Handle authentication handshake
- Implement reconnection strategy
- Maintain heartbeat

### Simulation Engine
- Parse incoming commands
- Analyze command impact
- Simulate execution in sandbox
- Generate simulation report
- Assess risk level

### PTY Execution
- Execute approved commands via node-pty
- Stream output in real-time
- Handle command signals
- Clean up on completion

### Directory Isolation
- Enforce capability-based access
- Validate all file paths
- Block unauthorized access
- Sandbox filesystem operations

### Credential Management
- Store credentials securely
- Handle credential refresh
- Clear on logout/teardown
- Validate credential expiry

---

## 🔌 WebSocket Protocol

### Agent → Backend Events
- `agent:authenticate` - Authenticate with credentials
- `agent:status` - Send status update
- `simulation:result` - Send simulation result
- `simulation:error` - Send simulation error
- `terminal:output` - Stream PTY output
- `terminal:exit` - Command completed
- `pong` - Heartbeat response

### Backend → Agent Events
- `authenticated` - Authentication confirmed
- `command:simulate` - Simulate command
- `command:execute` - Execute approved command
- `command:cancel` - Cancel execution
- `ping` - Heartbeat request

---

## 🛠️ CLI Commands

```bash
# Connect to backend
trymint connect

# Show connection status
trymint status

# Disconnect from backend
trymint disconnect

# Configure agent
trymint config

# Show help
trymint --help
```

---

## 🔐 Security Features

### Directory Capabilities
- Explicit allowed directory list
- Path traversal prevention
- Symlink resolution
- Real path validation

### Credential Security
- Credentials stored in secure location
- Automatic expiration
- Memory-only refresh tokens
- Secure deletion on logout

### Command Validation
- Dangerous command detection
- Argument sanitization
- Environment isolation

---

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development mode
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
