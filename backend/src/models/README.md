# Models Directory

This directory contains data model definitions.

## Structure

```
models/
├── user.ts              # User model
├── session.ts           # Session model
├── command.ts           # Command model
├── credential.ts        # Credential model
└── index.ts             # Model exports
```

## Model Descriptions

### user.ts
User data model.

**Fields:**
- `id` - Unique identifier
- `email` - User email
- `name` - Display name
- `picture` - Profile picture URL
- `googleId` - Google OAuth ID
- `createdAt` - Creation timestamp
- `lastLoginAt` - Last login timestamp

### session.ts
Session data model.

**Fields:**
- `id` - Session identifier
- `userId` - Associated user ID
- `token` - Session token
- `createdAt` - Creation timestamp
- `expiresAt` - Expiration timestamp
- `isActive` - Active status
- `capabilities` - Allowed directories
- `agentId` - Connected agent ID

### command.ts
Command data model.

**Fields:**
- `id` - Command identifier
- `sessionId` - Associated session
- `command` - Command string
- `status` - Execution status
- `submittedAt` - Submission timestamp
- `simulatedAt` - Simulation timestamp
- `approvedAt` - Approval timestamp
- `executedAt` - Execution timestamp
- `simulationResult` - Simulation output
- `executionResult` - Execution output
- `approved` - Approval status

### credential.ts
Agent credential model.

**Fields:**
- `id` - Credential identifier
- `sessionId` - Associated session
- `token` - Credential token
- `createdAt` - Creation timestamp
- `expiresAt` - Expiration timestamp
- `isRevoked` - Revocation status
