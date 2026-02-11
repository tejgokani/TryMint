# Threat Model

> TRYMINT Threat Analysis

---

## 📋 Overview

This document identifies potential threats to TRYMINT and the mitigations in place.

---

## 🎯 Assets

| Asset | Description | Sensitivity |
|-------|-------------|-------------|
| User Credentials | OAuth tokens | High |
| Session Tokens | JWT session tokens | High |
| Agent Credentials | Backend-issued credentials | High |
| Commands | User command input | Medium |
| Filesystem | User's local files | High |
| PTY Output | Command execution output | Medium |

---

## 👤 Threat Actors

| Actor | Motivation | Capability |
|-------|------------|------------|
| External Attacker | Data theft, system access | Network access |
| Malicious User | Abuse, unauthorized access | Authenticated access |
| Compromised Agent | Lateral movement | Local machine access |

---

## ⚠️ Threats and Mitigations

### T1: Session Hijacking

**Description**: Attacker steals session token to impersonate user.

**Mitigations**:
- Short-lived session tokens (1 hour)
- HTTPS-only transmission
- HttpOnly cookies (where applicable)
- Session binding to IP (optional)

### T2: Credential Theft from Agent

**Description**: Attacker extracts stored credentials from agent.

**Mitigations**:
- Encrypted credential storage
- Restrictive file permissions (0600)
- Memory-only sensitive data where possible
- Automatic credential expiry

### T3: Path Traversal Attack

**Description**: Malicious command accesses files outside allowed directories.

**Mitigations**:
- Real path resolution
- Capability validation
- Block ".." patterns
- Symlink resolution and validation

### T4: Command Injection

**Description**: Malicious input injected into command execution.

**Mitigations**:
- Input sanitization
- Command parsing validation
- Simulation preview
- User approval required

### T5: Man-in-the-Middle Attack

**Description**: Attacker intercepts communication between components.

**Mitigations**:
- TLS for all connections
- Certificate validation
- WebSocket over TLS (WSS)

### T6: Denial of Service

**Description**: Attacker overwhelms system with requests.

**Mitigations**:
- Rate limiting
- Request throttling
- Connection limits
- Resource quotas

### T7: Unauthorized Agent Connection

**Description**: Malicious agent connects to user's session.

**Mitigations**:
- Agent credential verification
- Session-bound credentials
- Single agent per session
- Connection validation

### T8: Session Persistence After Logout

**Description**: Session remains active after user logs out.

**Mitigations**:
- Mandatory teardown on logout
- Token revocation
- Agent disconnection
- Credential clearing

---

## 🔍 STRIDE Analysis

| Category | Threat | Mitigation |
|----------|--------|------------|
| **S**poofing | Fake user identity | OAuth authentication |
| **T**ampering | Modify commands | Input validation, TLS |
| **R**epudiation | Deny actions | Audit logging |
| **I**nfo Disclosure | Leak credentials | Encryption, short TTL |
| **D**enial of Service | Overwhelm system | Rate limiting |
| **E**levation of Privilege | Access unauthorized files | Capabilities |

---

## 📊 Risk Matrix

| Threat | Likelihood | Impact | Risk Level |
|--------|------------|--------|------------|
| Session Hijacking | Medium | High | High |
| Credential Theft | Low | High | Medium |
| Path Traversal | Medium | High | High |
| Command Injection | Low | High | Medium |
| MITM | Low | High | Medium |
| DoS | Medium | Medium | Medium |
| Unauthorized Agent | Low | High | Medium |
| Session Persistence | Low | Medium | Low |

---

## 🔗 Related Documents

- [Security Model](model.md)
- [Security Boundaries](boundaries.md)
