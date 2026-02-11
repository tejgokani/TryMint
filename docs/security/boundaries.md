# Security Boundaries

> Component Security Boundary Definitions

---

## 📋 Overview

This document defines the security boundaries between TRYMINT components and the controls at each boundary.

---

## 🏰 Boundary Definitions

### Boundary 1: Internet ↔ Frontend

**Location**: Browser
**Trust Level Change**: Untrusted → Client

| Control | Description |
|---------|-------------|
| HTTPS | Encrypted transport |
| CSP | Content Security Policy |
| CORS | Cross-origin restrictions |

### Boundary 2: Frontend ↔ Backend

**Location**: API Gateway
**Trust Level Change**: Client → Authenticated

| Control | Description |
|---------|-------------|
| TLS | Encrypted transport |
| JWT Validation | Token verification |
| Rate Limiting | Request throttling |
| Input Validation | Request sanitization |
| CORS | Origin verification |

### Boundary 3: Backend ↔ Agent

**Location**: WebSocket Connection
**Trust Level Change**: Server → Agent

| Control | Description |
|---------|-------------|
| TLS | Encrypted WebSocket |
| Agent Authentication | Credential verification |
| Session Binding | Agent tied to session |
| Heartbeat | Connection health |

### Boundary 4: Agent ↔ Filesystem

**Location**: Isolation Layer
**Trust Level Change**: Agent → Restricted

| Control | Description |
|---------|-------------|
| Capability Checking | Directory access verification |
| Path Resolution | Real path validation |
| Traversal Prevention | Block .. patterns |
| Symlink Handling | Resolve and validate |

---

## 🔐 Boundary Controls

### Authentication Boundary

```
┌─────────────────────────────────────────┐
│           UNAUTHENTICATED               │
│                                         │
│  • Can access: /login, /health          │
│  • Cannot access: All other routes      │
│                                         │
└────────────────┬────────────────────────┘
                 │
                 │ Google OAuth + JWT
                 ▼
┌─────────────────────────────────────────┐
│            AUTHENTICATED                │
│                                         │
│  • Valid JWT required                   │
│  • Session must be active               │
│  • User identity verified               │
│                                         │
└─────────────────────────────────────────┘
```

### Session Boundary

```
┌─────────────────────────────────────────┐
│           NO SESSION                    │
│                                         │
│  • Can authenticate                     │
│  • Cannot submit commands               │
│  • Cannot connect agent                 │
│                                         │
└────────────────┬────────────────────────┘
                 │
                 │ Session Creation
                 ▼
┌─────────────────────────────────────────┐
│          ACTIVE SESSION                 │
│                                         │
│  • Session ID assigned                  │
│  • Capabilities defined                 │
│  • Expiration set                       │
│  • Agent can connect                    │
│                                         │
└─────────────────────────────────────────┘
```

### Capability Boundary

```
┌─────────────────────────────────────────┐
│         UNRESTRICTED                    │
│                                         │
│  (Never allowed - all access            │
│   must go through capabilities)         │
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│       CAPABILITY RESTRICTED             │
│                                         │
│  • Explicit directory list              │
│  • Explicit permissions (r/w/x)         │
│  • Recursive or not                     │
│  • All paths validated                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚧 Boundary Enforcement

### At Each Request
1. Validate authentication token
2. Check session validity
3. Verify operation permission
4. Validate input data

### At Agent Operations
1. Authenticate agent credentials
2. Verify session binding
3. Check capability for path
4. Validate resolved path

### At Filesystem Access
1. Resolve real path
2. Check against capabilities
3. Verify permission type
4. Log access attempt

---

## 🔗 Related Documents

- [Security Model](model.md)
- [Threat Model](threats.md)
