# Troubleshooting

> Common Issues and Solutions

---

## 📋 Overview

This guide helps resolve common issues with TRYMINT.

---

## 🔐 Authentication Issues

### OAuth Redirect Error

**Symptom**: Error after Google login

**Possible Causes**:
- Incorrect redirect URI
- Missing OAuth configuration

**Solution**:
1. Verify redirect URI in Google Console
2. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Ensure callback URL matches exactly

### Token Expired

**Symptom**: Suddenly logged out

**Possible Causes**:
- Session TTL exceeded
- Server restarted

**Solution**:
1. Re-login
2. Increase `SESSION_TTL_SECONDS` if needed

---

## 🔌 Connection Issues

### Agent Won't Connect

**Symptom**: Agent fails to connect to backend

**Possible Causes**:
- Invalid credentials
- Backend not running
- Network issues

**Solution**:
1. Verify backend is running
2. Check WebSocket URL
3. Regenerate agent credentials
4. Check firewall settings

### WebSocket Disconnects

**Symptom**: Frequent disconnections

**Possible Causes**:
- Network instability
- Heartbeat timeout

**Solution**:
1. Check network stability
2. Increase heartbeat interval
3. Check proxy/firewall settings

---

## 💻 Execution Issues

### Simulation Fails

**Symptom**: Simulation returns error

**Possible Causes**:
- Command not allowed
- Path outside capabilities
- Simulation timeout

**Solution**:
1. Check directory capabilities
2. Verify command syntax
3. Check agent logs

### PTY Output Missing

**Symptom**: No output displayed

**Possible Causes**:
- Output buffer issues
- WebSocket problems
- Encoding issues

**Solution**:
1. Check WebSocket connection
2. Verify agent is connected
3. Check terminal configuration

---

## 🛠️ Development Issues

### Dependencies Won't Install

**Symptom**: pnpm install fails

**Solution**:
1. Clear pnpm cache: `pnpm store prune`
2. Delete node_modules: `rm -rf node_modules`
3. Delete lockfile: `rm pnpm-lock.yaml`
4. Reinstall: `pnpm install`

### TypeScript Errors

**Symptom**: Type errors on build

**Solution**:
1. Run `pnpm typecheck`
2. Check for missing types
3. Verify tsconfig.json

### node-pty Build Fails

**Symptom**: Native module compilation error

**Solution**:
1. Install build tools
2. macOS: `xcode-select --install`
3. Linux: `apt-get install build-essential`

---

## 📝 Logs

### Frontend Logs
- Browser DevTools Console
- Network tab for requests

### Backend Logs
- Terminal output
- Log files (if configured)

### Agent Logs
- Terminal output
- `~/.trymint/logs/` (if configured)

---

## 🆘 Getting Help

1. Check this troubleshooting guide
2. Search existing issues
3. Create new issue with:
   - Environment details
   - Steps to reproduce
   - Error messages
   - Relevant logs

---

## 🔗 Related Documents

- [Development Setup](development.md)
- [Quick Start](quickstart.md)
