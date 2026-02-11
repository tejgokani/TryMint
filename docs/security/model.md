# Security Model

> TRYMINT Security Architecture

---

## 📋 Overview

This document describes the security model for TRYMINT, including security principles, trust boundaries, and protection mechanisms.

---

## 🔐 Security Principles

### 1. Simulation First
Every command is simulated before execution. This provides:
- Preview of command effects
- Risk assessment
- User confirmation requirement
- Audit trail

### 2. Explicit Authorization
No command executes without explicit user approval:
- User reviews simulation results
- User explicitly clicks approve
- Rejection is the default

### 3. Least Privilege
Components operate with minimum required permissions:
- Agents limited to defined directories
- Sessions have defined capabilities
- Credentials have limited scope

### 4. Short-Lived Credentials
All credentials expire automatically:
- Session tokens (1 hour default)
- Agent credentials (session-bound)
- OAuth tokens (standard expiry)

### 5. Defense in Depth
Multiple security layers:
- Authentication (OAuth)
- Authorization (session + capabilities)
- Isolation (directory capabilities)
- Validation (input sanitization)

---

## 🏰 Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                      UNTRUSTED ZONE                              │
│                                                                  │
│   ┌─────────────────┐           ┌─────────────────┐             │
│   │    Internet     │           │  User Input     │             │
│   └────────┬────────┘           └────────┬────────┘             │
│            │                             │                       │
└────────────┼─────────────────────────────┼───────────────────────┘
             │                             │
    ═════════╪═════════════════════════════╪═════════════════════
             │     TRUST BOUNDARY 1        │
             │     (Authentication)        │
    ═════════╪═════════════════════════════╪═════════════════════
             │                             │
             ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATED ZONE                            │
│                                                                  │
│   ┌─────────────────┐           ┌─────────────────┐             │
│   │    Frontend     │◄─────────►│    Backend      │             │
│   └─────────────────┘           └────────┬────────┘             │
│                                          │                       │
└──────────────────────────────────────────┼───────────────────────┘
                                           │
    ═══════════════════════════════════════╪═════════════════════
                                           │ TRUST BOUNDARY 2
                                           │ (Session + Capabilities)
    ═══════════════════════════════════════╪═════════════════════
                                           │
                                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION ZONE                                │
│                                                                  │
│   ┌─────────────────┐           ┌─────────────────┐             │
│   │     Agent       │──────────►│   Local Shell   │             │
│   └─────────────────┘           └─────────────────┘             │
│                                                                  │
│              │                                                   │
│              │                                                   │
│    ══════════╪══════════════════════════════════════════════    │
│              │ TRUST BOUNDARY 3                                  │
│              │ (Directory Capabilities)                          │
│    ══════════╪══════════════════════════════════════════════    │
│              ▼                                                   │
│   ┌─────────────────┐                                           │
│   │   Filesystem    │                                           │
│   │  (Restricted)   │                                           │
│   └─────────────────┘                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Protection Mechanisms

### Authentication
| Mechanism | Description |
|-----------|-------------|
| Google OAuth | Third-party identity verification |
| JWT Tokens | Signed session tokens |
| Token Expiry | Automatic credential expiration |
| Token Refresh | Secure token renewal |

### Authorization
| Mechanism | Description |
|-----------|-------------|
| Session Validation | Verify active session |
| Capability Checking | Verify directory access |
| Approval Workflow | Require explicit approval |

### Input Validation
| Mechanism | Description |
|-----------|-------------|
| Command Sanitization | Clean command input |
| Path Validation | Verify path access |
| Rate Limiting | Prevent abuse |

### Isolation
| Mechanism | Description |
|-----------|-------------|
| Directory Capabilities | Restrict filesystem access |
| Path Resolution | Prevent traversal attacks |
| Sandbox Execution | Isolated simulation |

---

## ⚠️ Security Considerations

### What TRYMINT Protects Against
- Accidental destructive commands
- Unauthorized filesystem access
- Session hijacking (short TTL)
- Credential exposure (encryption)

### What TRYMINT Does NOT Protect Against
- Compromised local machine
- Malicious authenticated user
- Kernel-level exploits
- Commands approved by user

---

## 🔗 Related Documents

- [Security Boundaries](boundaries.md)
- [Threat Model](threats.md)
- [Credential Management](credentials.md)
