# Agent Credentials

> Credential management and storage

## Purpose

Manages short-lived session credentials. Handles secure storage, validation, refresh, and cleanup of credentials.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Credential manager class |
| `store.js` | Secure credential storage |
| `refresh.js` | Credential refresh logic |
| `validate.js` | Credential validation |

## Credential Structure

```
Credential {
  token: string           # Short-lived access token
  sessionId: string       # Bound session ID
  capabilities: string[]  # Allowed directory paths
  expiresAt: timestamp    # Expiration time
  issuedAt: timestamp     # Issue time
}
```

## Storage Options

### store.js

| Method | Purpose |
|--------|---------|
| `save(credential)` | Store credential securely |
| `load()` | Load stored credential |
| `clear()` | Remove stored credential |
| `exists()` | Check if credential exists |

Storage backends:
- **OS Keychain** (preferred) - macOS Keychain, Windows Credential Manager
- **Encrypted file** (fallback) - AES-256 encrypted file

## Validation

### validate.js

| Function | Purpose |
|----------|---------|
| `isValid(credential)` | Check if credential is valid |
| `isExpired(credential)` | Check expiration |
| `isExpiringSoon(credential)` | Check if expiring within threshold |
| `matchesSession(credential, sessionId)` | Verify session binding |

## Refresh Logic

### refresh.js

| Function | Purpose |
|----------|---------|
| `shouldRefresh(credential)` | Determine if refresh needed |
| `refresh(connection)` | Request new credential from backend |
| `handleRefreshResponse(response)` | Process refresh response |

Refresh triggers:
- Less than 5 minutes until expiry
- Backend requests refresh
- Manual refresh request

## Security Considerations

- Credentials never logged or printed
- Stored encrypted at rest
- Memory cleared after use
- Auto-clear on session end
- No credential caching beyond session
