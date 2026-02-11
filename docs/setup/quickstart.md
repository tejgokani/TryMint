# Quick Start Guide

> Get TRYMINT running quickly

---

## 📋 Overview

This guide helps you get TRYMINT running in development mode.

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] Node.js 18.x or higher
- [ ] pnpm 8.x or higher
- [ ] Google Cloud Console account
- [ ] macOS or Linux environment

---

## 🔧 Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd trymint
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

---

## 🔑 Step 3: Configure Google OAuth

1. Go to Google Cloud Console
2. Create a new project (or use existing)
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Set authorized redirect URI:
   - `http://localhost:3001/auth/google/callback`
6. Copy Client ID and Client Secret

---

## ⚙️ Step 4: Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your values
```

**Required values**:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SESSION_SECRET`
- `JWT_SECRET`

---

## 🚀 Step 5: Start Development Servers

```bash
# Start all services
pnpm dev
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## 🤖 Step 6: Connect Agent

In a new terminal:

```bash
# Navigate to agent
cd agent

# Start agent and connect
pnpm dev
```

Follow prompts to enter credentials.

---

## ✅ Verification

1. Open http://localhost:3000
2. Click "Login with Google"
3. Complete OAuth flow
4. Verify agent connects
5. Try a simple command

---

## 🔗 Next Steps

- [Development Setup](development.md) - Detailed development guide
- [Configuration](../agent/configuration.md) - Agent configuration
- [Troubleshooting](troubleshooting.md) - Common issues
