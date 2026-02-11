# Agent Installation

> Installing the TRYMINT Agent

---

## 📋 Overview

This guide covers installation of the TRYMINT agent on your local machine.

---

## 📦 Installation Methods

### Method 1: From Source (Development)

```bash
# Clone repository
git clone <repository-url>
cd trymint

# Install dependencies
pnpm install

# Build agent
pnpm --filter agent build

# Link globally (optional)
cd agent && pnpm link --global
```

### Method 2: npm Package (Future)

```bash
# Install globally
npm install -g @trymint/agent

# Verify installation
trymint --version
```

### Method 3: Direct Binary (Future)

Download pre-built binary from releases page.

---

## ✅ Prerequisites

### System Requirements

| Requirement | Description |
|-------------|-------------|
| OS | macOS 12+ or Linux |
| Node.js | 18.x or higher (for source) |
| Shell | zsh or bash |

### Build Requirements (Source)

| Requirement | Description |
|-------------|-------------|
| Python | For node-pty compilation |
| Build tools | Xcode CLI (macOS) or build-essential (Linux) |

---

## 🔧 Build Tools Installation

### macOS

```bash
xcode-select --install
```

### Ubuntu/Debian

```bash
sudo apt-get install build-essential python3
```

---

## ✅ Verify Installation

```bash
# Check version
trymint --version

# Check help
trymint --help
```

---

## 📁 File Locations

| Item | Location |
|------|----------|
| Configuration | `~/.trymint/config.json` |
| Credentials | `~/.trymint/credentials` |
| Logs | `~/.trymint/logs/` |

---

## 🔗 Related Documents

- [Configuration Guide](configuration.md)
- [CLI Reference](commands.md)
- [Troubleshooting](../setup/troubleshooting.md)
