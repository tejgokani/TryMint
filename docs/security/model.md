# Security Model

> TRYMINT security model and boundaries

## Security Principles

1. **Simulation First** - Every command is simulated before execution
2. **Explicit Approval** - No command executes without user approval
3. **Short-lived Credentials** - Credentials expire quickly, limiting attack window
4. **Capability Isolation** - Directory-based access control
5. **Session Binding** - Agent cryptographically bound to user session
6. **Mandatory Teardown** - Clean logout required, all state cleared

## Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY 1                                  │
│                        Browser Security Sandbox                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND                                     │   │
│  │  • OAuth token handling (httpOnly cookies preferred)                 │   │
│  │  • No sensitive data in localStorage                                 │   │
│  │  • CSRF protection                                                   │   │
│  │  • XSS prevention                                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                            HTTPS / WSS
                          (TLS encrypted)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY 2                                  │
│                        Backend Server Boundary                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         BACKEND                                      │   │
│  │  • Token validation (JWT signature verification)                     │   │
│  │  • Session management                                                │   │
│  │  • Credential generation (cryptographic)                             │   │
│  │  • Rate limiting                                                     │   │
│  │  • Input validation                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                        WSS (authenticated)
                     (Credential-protected)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY 3                                  │
│                         Local Agent Boundary                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          AGENT                                       │   │
│  │  • Credential validation                                             │   │
│  │  • Capability enforcement                                            │   │
│  │  • Path validation (symlink resolution)                              │   │
│  │  • Command parsing                                                   │   │
│  │  • Process isolation                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                          Sandboxed PTY
                    (Capability-restricted)
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TRUST BOUNDARY 4                                  │
│                      Allowed Directory Access                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FILE SYSTEM ACCESS                                │   │
│  │  • Only directories specified in capabilities                        │   │
│  │  • No parent directory traversal                                     │   │
│  │  • Symlinks resolved and validated                                   │   │
│  │  • Environment sanitized                                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Threat Mitigations

| Threat | Mitigation |
|--------|------------|
| Credential Theft | Short TTL, secure storage, no logging |
| Session Hijacking | Session binding, token refresh, IP checking |
| Command Injection | Parsing, validation, no shell eval |
| Path Traversal | Resolution, canonicalization, capability check |
| Privilege Escalation | Capability isolation, sandboxing |
| Replay Attacks | Nonce, timestamp, credential rotation |
| Man-in-the-Middle | TLS everywhere |
| Denial of Service | Rate limiting, resource limits |

## Command Flow Security

```
1. SUBMIT
   └─► Input validation
   └─► Rate limiting
   └─► Session verification

2. SIMULATE
   └─► Parse command (no execution)
   └─► Predict effects
   └─► Check capabilities
   └─► Calculate risk level

3. APPROVE
   └─► User explicitly approves
   └─► Cannot skip (enforced)
   └─► Timeout on pending approval

4. EXECUTE
   └─► Re-validate credentials
   └─► Re-check capabilities
   └─► Spawn in PTY sandbox
   └─► Resource limits applied

5. COMPLETE
   └─► Log execution
   └─► Clear sensitive data
```

## Credential Security

- **Generation**: Cryptographically random (crypto.randomBytes)
- **Storage**: OS keychain or encrypted file
- **Transmission**: TLS only
- **Validation**: Signature + expiry + capability check
- **Revocation**: Immediate on logout, tracked in backend
- **Rotation**: New credential on refresh, old invalidated
