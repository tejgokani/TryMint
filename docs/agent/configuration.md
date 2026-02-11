# Agent Configuration

> Configuring the TRYMINT Agent

---

## 📋 Overview

This guide covers configuration options for the TRYMINT agent.

---

## 📁 Configuration File

**Location**: `~/.trymint/config.json`

```json
{
  "backend": {
    "url": "wss://api.trymint.app/ws",
    "reconnectInterval": 5000,
    "heartbeatInterval": 30000
  },
  "credentials": {
    "path": "~/.trymint/credentials"
  },
  "logging": {
    "level": "info",
    "file": "~/.trymint/logs/agent.log"
  },
  "capabilities": {
    "directories": []
  }
}
```

---

## ⚙️ Configuration Options

### Backend Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backend.url` | string | - | WebSocket URL |
| `backend.reconnectInterval` | number | 5000 | Reconnect delay (ms) |
| `backend.heartbeatInterval` | number | 30000 | Heartbeat interval (ms) |

### Credential Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `credentials.path` | string | ~/.trymint/credentials | Credential file location |

### Logging Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logging.level` | string | info | Log level |
| `logging.file` | string | - | Log file path |

### Capability Settings

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `capabilities.directories` | array | [] | Allowed directories |

---

## 📂 Directory Capabilities

Configure allowed directories:

```json
{
  "capabilities": {
    "directories": [
      {
        "path": "/Users/user/projects",
        "permissions": ["read", "write", "execute"],
        "recursive": true
      },
      {
        "path": "/tmp",
        "permissions": ["read", "write"],
        "recursive": false
      }
    ]
  }
}
```

### Permissions

| Permission | Description |
|------------|-------------|
| `read` | Read files and list directories |
| `write` | Create, modify, delete files |
| `execute` | Execute commands in directory |

---

## 🌍 Environment Variables

Override config via environment:

| Variable | Description |
|----------|-------------|
| `TRYMINT_BACKEND_URL` | WebSocket URL |
| `TRYMINT_CREDENTIAL_PATH` | Credential path |
| `TRYMINT_LOG_LEVEL` | Log level |

---

## 🔧 Interactive Configuration

```bash
# Run configuration wizard
trymint config
```

---

## 🔗 Related Documents

- [Installation Guide](installation.md)
- [CLI Reference](commands.md)
