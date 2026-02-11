# Agent CLI Reference

> TRYMINT Agent Command Reference

---

## 📋 Overview

This document provides reference for all TRYMINT agent CLI commands.

---

## 🔧 Global Options

| Option | Alias | Description |
|--------|-------|-------------|
| `--version` | `-v` | Show version |
| `--help` | `-h` | Show help |
| `--config` | `-c` | Config file path |
| `--verbose` | | Enable verbose logging |

---

## 📝 Commands

### trymint connect

Connect agent to backend.

**Usage**:
```bash
trymint connect [options]
```

**Options**:
| Option | Description |
|--------|-------------|
| `--url <url>` | Backend WebSocket URL |
| `--token <token>` | Use provided token |

**Interactive Mode**:
If credentials not provided, prompts for input.

**Example**:
```bash
trymint connect
# or
trymint connect --url wss://api.trymint.app/ws
```

---

### trymint disconnect

Disconnect agent from backend.

**Usage**:
```bash
trymint disconnect
```

**Behavior**:
- Sends disconnect message
- Clears credentials
- Exits daemon mode

---

### trymint status

Show agent status.

**Usage**:
```bash
trymint status
```

**Output**:
```
TRYMINT Agent Status
────────────────────
Status:      Connected
Session:     session_abc123
Expires:     2024-01-01T01:00:00Z
Backend:     wss://api.trymint.app/ws

Capabilities:
  /Users/user/projects  [r,w,x] (recursive)
  /tmp                  [r,w]
```

---

### trymint config

Configure agent settings.

**Usage**:
```bash
trymint config [options]
```

**Options**:
| Option | Description |
|--------|-------------|
| `--show` | Display current config |
| `--reset` | Reset to defaults |
| `--set <key=value>` | Set config value |

**Interactive Mode**:
Without options, runs configuration wizard.

---

### trymint logs

View agent logs.

**Usage**:
```bash
trymint logs [options]
```

**Options**:
| Option | Description |
|--------|-------------|
| `--follow` / `-f` | Follow log output |
| `--lines <n>` | Show last n lines |
| `--level <level>` | Filter by level |

---

### trymint capabilities

Manage directory capabilities.

**Usage**:
```bash
trymint capabilities [subcommand]
```

**Subcommands**:
| Subcommand | Description |
|------------|-------------|
| `list` | List all capabilities |
| `add <path>` | Add directory |
| `remove <path>` | Remove directory |

---

## 🚦 Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Connection error |
| 3 | Authentication error |
| 4 | Configuration error |

---

## 🔗 Related Documents

- [Installation Guide](installation.md)
- [Configuration Guide](configuration.md)
