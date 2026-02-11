# Credentials Directory

This directory contains credential management.

## Structure

```
credentials/
├── store.ts             # Credential storage
├── secure.ts            # Secure storage
└── refresh.ts           # Credential refresh
```

## Component Descriptions

### store.ts
Credential storage management.

**Responsibilities:**
- Store credentials
- Retrieve credentials
- Delete credentials
- Check credential validity
- Handle storage errors

**Storage Location:**
- Default: `~/.trymint/credentials`
- Configurable via environment

**Stored Data:**
- Session token
- Agent credentials
- Expiration timestamp
- Session metadata

### secure.ts
Secure credential storage.

**Responsibilities:**
- Encrypt credentials at rest
- Decrypt credentials on read
- Manage encryption keys
- Handle key rotation
- Secure deletion

**Security Measures:**
- File permissions (0600)
- Encryption at rest
- Memory wiping
- Secure deletion

### refresh.ts
Credential refresh logic.

**Responsibilities:**
- Monitor credential expiry
- Request credential refresh
- Update stored credentials
- Handle refresh failures
- Notify on refresh

**Refresh Flow:**
1. Monitor expiry time
2. Trigger refresh before expiry
3. Request new credentials
4. Validate new credentials
5. Update storage
6. Notify success/failure
