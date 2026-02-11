# Agent Overview

> TRYMINT Agent Architecture

---

## 📋 Overview

The TRYMINT agent is a local CLI daemon that runs on the user's machine. It handles command simulation, PTY-based execution, and enforces directory capability isolation.

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         AGENT                                  │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐    │
│   │     CLI     │     │  Credential │     │   Config    │    │
│   │  Interface  │     │    Store    │     │   Loader    │    │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘    │
│          │                   │                   │            │
│          └───────────────────┼───────────────────┘            │
│                              │                                 │
│                              ▼                                 │
│                    ┌─────────────────┐                        │
│                    │   Connection    │                        │
│                    │    Manager      │                        │
│                    └────────┬────────┘                        │
│                             │                                  │
│              ┌──────────────┼──────────────┐                  │
│              │              │              │                   │
│              ▼              ▼              ▼                   │
│     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│     │  Simulation │ │  Execution  │ │  Isolation  │          │
│     │   Engine    │ │   Engine    │ │   Layer     │          │
│     └─────────────┘ └─────────────┘ └─────────────┘          │
│                             │                                  │
│                             ▼                                  │
│                    ┌─────────────────┐                        │
│                    │    node-pty     │                        │
│                    │   (PTY Shell)   │                        │
│                    └─────────────────┘                        │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 🔑 Key Components

### CLI Interface
Entry point for user commands. Handles connect, disconnect, status, and configuration.

### Credential Store
Securely stores session credentials in encrypted format with restricted file permissions.

### Connection Manager
Manages WebSocket connection to backend with reconnection logic and heartbeat.

### Simulation Engine
Analyzes commands and simulates execution in sandbox environment.

### Execution Engine
Executes approved commands via node-pty with output streaming.

### Isolation Layer
Enforces directory capabilities and validates all path access.

---

## 🔄 Agent Lifecycle

```
┌─────────────────┐
│     STOPPED     │
└────────┬────────┘
         │ trymint connect
         ▼
┌─────────────────┐
│  AUTHENTICATING │
└────────┬────────┘
         │ Credentials validated
         ▼
┌─────────────────┐
│   CONNECTED     │
└────────┬────────┘
         │ Ready for commands
         ▼
┌─────────────────┐
│     ACTIVE      │◄────┐
└────────┬────────┘     │
         │              │ Command complete
         │ Command      │
         ▼              │
┌─────────────────┐     │
│   EXECUTING     │─────┘
└────────┬────────┘
         │
         │ Logout or error
         ▼
┌─────────────────┐
│  DISCONNECTING  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     STOPPED     │
└─────────────────┘
```

---

## 🔐 Security Features

| Feature | Description |
|---------|-------------|
| Capability Isolation | Access restricted to defined directories |
| Credential Encryption | Stored credentials encrypted at rest |
| Secure Deletion | Credentials wiped on logout |
| Path Validation | All paths validated against capabilities |
| PTY Isolation | Commands run in controlled PTY |

---

## 🔗 Related Documents

- [Installation Guide](installation.md)
- [Configuration Guide](configuration.md)
- [CLI Reference](commands.md)
