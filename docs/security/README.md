# Security Documentation

> Security model and threat analysis

## Purpose

Documents the security model, threat analysis, security boundaries, and mitigation strategies for the TRYMINT platform.

## File Map

| File | Purpose |
|------|---------|
| `model.md` | Security model overview |
| `boundaries.md` | Security boundary definitions |
| `threats.md` | Threat analysis |
| `isolation.md` | Isolation mechanisms |
| `credentials.md` | Credential security |
| `audit.md` | Audit logging |

## Model (model.md)

Security principles:
- **Simulation First**: All commands simulated before execution
- **Explicit Approval**: No execution without user approval
- **Short-lived Credentials**: Time-bounded access tokens
- **Capability Isolation**: Directory-based access control
- **Session Binding**: Agent bound to user session
- **Mandatory Teardown**: Clean logout required

## Boundaries (boundaries.md)

Security boundaries:
```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  (Browser sandbox, OAuth token handling)        │
└─────────────────────────────────────────────────┘
                       │
              HTTPS / WSS
                       │
┌─────────────────────────────────────────────────┐
│                   Backend                        │
│  (Token validation, session management)          │
└─────────────────────────────────────────────────┘
                       │
              WSS (authenticated)
                       │
┌─────────────────────────────────────────────────┐
│                    Agent                         │
│  (Credential validation, capability enforcement) │
└─────────────────────────────────────────────────┘
                       │
              Sandboxed PTY
                       │
┌─────────────────────────────────────────────────┐
│               Allowed Directories                │
│  (Capability-restricted file system access)      │
└─────────────────────────────────────────────────┘
```

## Threats (threats.md)

Threat categories:
- Credential theft
- Session hijacking
- Command injection
- Path traversal
- Privilege escalation
- Denial of service

Mitigation strategies per threat.

## Isolation (isolation.md)

Isolation mechanisms:
- Directory capabilities
- Path validation
- Symlink resolution
- Environment sanitization
- Resource limits

## Credentials (credentials.md)

Credential security:
- Cryptographic generation
- Secure storage
- Short TTL
- Non-reusable
- Revocation support

## Audit (audit.md)

Audit events:
- Authentication events
- Session events
- Command events
- Capability violations
- Security alerts
