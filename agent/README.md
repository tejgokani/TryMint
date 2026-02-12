# TRYMINT Agent

> CLI for secure package management sandbox. Connect to TRYMINT backend to run npm install in an isolated environment.

## Installation

```bash
# Install globally (requires npm)
npm install -g trymint-agent

# Or run without installing
npx trymint-agent connect --session=SESS_XXX --token=YOUR_TOKEN
```

## Usage

```bash
# Connect to backend (production: set TRYMINT_WS_URL)
trymint connect --session=SESS_XXX --token=YOUR_TOKEN

# Or shortened
trymint connect -s SESS_XXX -t YOUR_TOKEN
```

For production (Render backend), set the WebSocket URL:

```bash
TRYMINT_WS_URL=https://trymint.onrender.com trymint connect -s SESS_XXX -t YOUR_TOKEN
```

**Windows (PowerShell):**
```powershell
$env:TRYMINT_WS_URL="https://trymint.onrender.com"; trymint connect -s SESS_XXX -t YOUR_TOKEN
```

Get session credentials from the [TRYMINT web app](https://trymint.vercel.app) → Start Session.

---

## Purpose

The agent is a CLI tool that runs on the user's local machine. It:
- Connects to the TRYMINT backend via WebSocket
- Receives commands for simulation and execution
- Runs commands in isolated PTY sessions
- Enforces directory capability restrictions
- Streams output back to the backend
- Handles session credential lifecycle

## Folder Structure

```
agent/
├── src/
│   ├── cli/                # CLI interface
│   ├── connection/         # WebSocket client
│   ├── credentials/        # Credential management
│   ├── execution/          # Command execution
│   ├── isolation/          # Directory isolation
│   ├── simulation/         # Command simulation
│   └── index.js            # Entry point
├── package.json            # Package configuration
└── README.md               # This file
```

## File Map

### `/src/cli/`
| File | Purpose |
|------|---------|
| `index.js` | CLI entry and argument parsing |
| `commands.js` | CLI command definitions |
| `prompts.js` | Interactive prompts |
| `output.js` | Terminal output formatting |

### `/src/connection/`
| File | Purpose |
|------|---------|
| `index.js` | WebSocket client manager |
| `handlers.js` | Message handlers |
| `reconnect.js` | Reconnection logic |
| `heartbeat.js` | Heartbeat management |

### `/src/credentials/`
| File | Purpose |
|------|---------|
| `index.js` | Credential manager |
| `store.js` | Secure credential storage |
| `refresh.js` | Credential refresh logic |
| `validate.js` | Credential validation |

### `/src/execution/`
| File | Purpose |
|------|---------|
| `index.js` | Execution coordinator |
| `pty.js` | PTY session management (node-pty) |
| `stream.js` | Output streaming |
| `lifecycle.js` | Execution lifecycle |

### `/src/isolation/`
| File | Purpose |
|------|---------|
| `index.js` | Isolation manager |
| `capabilities.js` | Capability checker |
| `sandbox.js` | Sandbox environment |
| `paths.js` | Path validation |

### `/src/simulation/`
| File | Purpose |
|------|---------|
| `index.js` | Simulation coordinator |
| `parser.js` | Command parser |
| `predictor.js` | Effect prediction |
| `validator.js` | Safety validation |

## CLI Commands

```
trymint connect    # Connect to backend with session token
trymint status     # Show connection and session status
trymint disconnect # Disconnect and cleanup
trymint version    # Show agent version
```

## Agent Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent CLI                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User runs: trymint connect <token>                     │
│                         │                                   │
│                         ▼                                   │
│  2. Agent validates credentials                             │
│                         │                                   │
│                         ▼                                   │
│  3. Agent connects to backend via WebSocket                 │
│                         │                                   │
│                         ▼                                   │
│  4. Agent waits for commands                                │
│     ┌───────────────────┼───────────────────┐              │
│     │                   │                   │              │
│     ▼                   ▼                   ▼              │
│  SIMULATE           EXECUTE            HEARTBEAT           │
│     │                   │                   │              │
│     ▼                   ▼                   │              │
│  Parse & Predict    PTY Spawn              │              │
│     │                   │                   │              │
│     ▼                   ▼                   │              │
│  Send Result       Stream Output           │              │
│                                             │              │
│  5. On disconnect: cleanup and exit        │              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

### Credential Handling
- Credentials are short-lived tokens
- Stored securely (OS keychain or encrypted file)
- Auto-expire and require refresh
- Revoked on session end

### Directory Isolation
- Capabilities define allowed directories
- Commands checked against capabilities
- Paths resolved and validated
- Symlink attacks prevented

### Execution Isolation
- PTY sessions for proper terminal emulation
- No shell injection possible
- Environment sanitized
- Resource limits applied

## Message Types Handled

| Message | Action |
|---------|--------|
| `simulate` | Parse command, predict effects, return result |
| `execute` | Spawn PTY, run command, stream output |
| `cancel` | Kill running process |
| `heartbeat` | Respond with status |
| `terminate` | Clean up and exit |

## Node-PTY Integration

The agent uses `node-pty` for:
- Full terminal emulation
- Proper signal handling
- Interactive command support
- Real-time output streaming

```
Command → node-pty spawn → PTY stream → WebSocket → Backend → Frontend
```

## Teardown on Logout

When session ends:
1. Kill any running processes
2. Clear credential store
3. Close WebSocket connection
4. Clean up temp files
5. Exit gracefully
