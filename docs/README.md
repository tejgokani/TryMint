# Documentation

> TRYMINT Project Documentation

---

## 📋 Overview

This directory contains all project documentation for TRYMINT. Documentation is organized by category to help developers, architects, and operators understand the system.

---

## 📁 Structure

```
docs/
├── architecture/        # System architecture
│   ├── overview.md      # Architecture overview
│   ├── components.md    # Component descriptions
│   ├── data-flow.md     # Data flow diagrams
│   └── decisions.md     # Architecture decisions
├── security/            # Security documentation
│   ├── model.md         # Security model
│   ├── boundaries.md    # Security boundaries
│   ├── threats.md       # Threat model
│   └── credentials.md   # Credential management
├── api/                 # API documentation
│   ├── overview.md      # API overview
│   ├── authentication.md# Auth endpoints
│   ├── sessions.md      # Session endpoints
│   └── commands.md      # Command endpoints
├── websocket/           # WebSocket documentation
│   ├── protocol.md      # Protocol specification
│   ├── events.md        # Event reference
│   └── messages.md      # Message schemas
├── agent/               # Agent documentation
│   ├── overview.md      # Agent overview
│   ├── installation.md  # Installation guide
│   ├── configuration.md # Configuration guide
│   └── commands.md      # CLI reference
├── sessions/            # Session documentation
│   ├── lifecycle.md     # Session lifecycle
│   ├── credentials.md   # Session credentials
│   └── teardown.md      # Logout teardown
├── setup/               # Setup documentation
│   ├── quickstart.md    # Quick start guide
│   ├── development.md   # Development setup
│   ├── production.md    # Production setup
│   └── troubleshooting.md# Common issues
└── README.md            # This file
```

---

## 📖 Document Categories

### Architecture
System design and component documentation.

- **overview.md** - High-level system architecture
- **components.md** - Detailed component descriptions
- **data-flow.md** - Data flow between components
- **decisions.md** - Architecture decision records

### Security
Security model and threat documentation.

- **model.md** - Security model overview
- **boundaries.md** - Security boundary definitions
- **threats.md** - Threat model and mitigations
- **credentials.md** - Credential management

### API
REST API reference documentation.

- **overview.md** - API design principles
- **authentication.md** - Auth endpoint reference
- **sessions.md** - Session endpoint reference
- **commands.md** - Command endpoint reference

### WebSocket
Real-time protocol documentation.

- **protocol.md** - WebSocket protocol spec
- **events.md** - Event type reference
- **messages.md** - Message schema reference

### Agent
Local agent documentation.

- **overview.md** - Agent architecture
- **installation.md** - Installation instructions
- **configuration.md** - Configuration options
- **commands.md** - CLI command reference

### Sessions
Session lifecycle documentation.

- **lifecycle.md** - Session state machine
- **credentials.md** - Credential generation
- **teardown.md** - Logout and cleanup

### Setup
Environment setup guides.

- **quickstart.md** - Get started quickly
- **development.md** - Dev environment setup
- **production.md** - Production deployment
- **troubleshooting.md** - Common issues

---

## 📝 Documentation Standards

### Formatting
- Use Markdown format
- Include table of contents for long documents
- Use code blocks for examples
- Include diagrams where helpful

### Structure
- Start with overview/purpose
- Include prerequisites
- Provide examples
- Link to related docs

### Maintenance
- Update with code changes
- Review periodically
- Mark deprecated sections
