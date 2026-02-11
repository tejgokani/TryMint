# Backend Models

> Data models and schemas

## Purpose

Data models define the shape of entities in the system. For a hackathon setup, these can be simple in-memory objects or schemas for a lightweight store.

## File Map

| File | Purpose |
|------|---------|
| `User.js` | User entity model |
| `Session.js` | Session entity model |
| `Command.js` | Command entity model |
| `Credential.js` | Credential entity model |
| `index.js` | Barrel export |

## Model Schemas

### User.js
```
User {
  id: string           # Unique identifier
  email: string        # Email from OAuth
  name: string         # Display name
  picture: string      # Avatar URL
  createdAt: timestamp # Account creation
  lastLogin: timestamp # Last login time
}
```

### Session.js
```
Session {
  id: string           # Session identifier
  userId: string       # Owner user ID
  agentId: string      # Bound agent ID
  status: enum         # active/expired/terminated
  createdAt: timestamp # Session start
  expiresAt: timestamp # Session expiry
  lastActivity: timestamp
}
```

### Command.js
```
Command {
  id: string           # Command identifier
  sessionId: string    # Parent session
  command: string      # Command text
  status: enum         # pending/simulating/approved/executing/completed/failed
  simulationResult: object
  executionResult: object
  createdAt: timestamp
  completedAt: timestamp
}
```

### Credential.js
```
Credential {
  id: string           # Credential identifier
  sessionId: string    # Parent session
  token: string        # Short-lived token
  capabilities: array  # Allowed directories
  createdAt: timestamp
  expiresAt: timestamp # Short TTL
}
```

## Storage

For hackathon: In-memory Map storage
For production: Redis or PostgreSQL
