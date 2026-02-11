# Development Setup

> Detailed Development Environment Setup

---

## 📋 Overview

This guide provides detailed setup instructions for TRYMINT development.

---

## 🖥️ System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| OS | macOS 12+ or Ubuntu 20.04+ |
| Node.js | 18.x or higher |
| pnpm | 8.x or higher |
| RAM | 8GB minimum |
| Disk | 2GB free space |

### Recommended

| Component | Recommendation |
|-----------|----------------|
| OS | macOS 14+ |
| Node.js | 20.x LTS |
| RAM | 16GB |

---

## 📦 Dependency Installation

### Node.js

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify
node --version
```

### pnpm

```bash
# Install pnpm
npm install -g pnpm

# Verify
pnpm --version
```

---

## 🔧 Project Setup

### Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd trymint

# Install dependencies
pnpm install
```

### Environment Configuration

```bash
# Copy environment template
cp .env.example .env
```

**Configure each section in `.env`**

---

## 🔑 Google OAuth Setup

### Create Project

1. Visit https://console.cloud.google.com
2. Create new project: "TRYMINT Development"
3. Enable APIs: Google+ API

### Create Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "TRYMINT Dev"

### Configure URIs

**Authorized JavaScript origins**:
- `http://localhost:3000`

**Authorized redirect URIs**:
- `http://localhost:3001/auth/google/callback`

### Save Credentials

Copy to `.env`:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

---

## 🏃 Running Development Servers

### All Services

```bash
# Start all services in parallel
pnpm dev
```

### Individual Services

```bash
# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend

# Agent only
pnpm dev:agent
```

---

## 🛠️ Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript
- Tailwind CSS IntelliSense

### Debugging

- Use VS Code debugger
- Attach to Node.js processes
- Use Chrome DevTools for frontend

---

## 📝 Code Style

### Linting

```bash
# Run linting
pnpm lint

# Auto-fix issues
pnpm lint --fix
```

### Type Checking

```bash
# Check types
pnpm typecheck
```

---

## 🔗 Related Documents

- [Quick Start](quickstart.md)
- [Production Setup](production.md)
- [Troubleshooting](troubleshooting.md)
