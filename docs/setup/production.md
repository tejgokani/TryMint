# Production Setup

> Production Deployment Guide

---

## 📋 Overview

This guide covers production deployment considerations for TRYMINT.

---

## ⚠️ Production Considerations

### Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure session secrets
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Review directory capabilities

---

## 🌐 Frontend Deployment

### Build

```bash
pnpm --filter frontend build
```

### Deployment Options

| Option | Description |
|--------|-------------|
| Vercel | Recommended for Next.js |
| Netlify | Alternative static hosting |
| Docker | Containerized deployment |

### Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - WebSocket URL

---

## 🖧 Backend Deployment

### Build

```bash
pnpm --filter backend build
```

### Deployment Options

| Option | Description |
|--------|-------------|
| Docker | Containerized deployment |
| PM2 | Process manager |
| Cloud Run | Serverless container |

### Environment Variables

All production values for:
- OAuth configuration
- Session secrets
- JWT secrets
- Database connections (if any)

---

## 🤖 Agent Distribution

### Build

```bash
pnpm --filter agent build
```

### Distribution Options

| Option | Description |
|--------|-------------|
| npm package | Install via npm |
| Binary | Compiled executable |
| Script | Direct download |

---

## 🔒 Security Configuration

### TLS/SSL

- Use valid certificates
- Enable HTTPS only
- Configure HSTS

### Secrets

- Use secret management service
- Rotate secrets regularly
- Never commit secrets

### Rate Limiting

- Configure per-IP limits
- Configure per-user limits
- Set WebSocket limits

---

## 📊 Monitoring

### Metrics to Track

- Request latency
- Error rates
- Active sessions
- Agent connections
- Command execution

### Logging

- Structured logging (JSON)
- Log aggregation
- Error alerting

---

## 🔗 Related Documents

- [Development Setup](development.md)
- [Security Model](../security/model.md)
