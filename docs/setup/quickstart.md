# Quick Start Guide

> Get TRYMINT running in development mode

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js >= 18.x
- [ ] npm >= 9.x
- [ ] Git
- [ ] Google Cloud Console project with OAuth 2.0 credentials

## Step 1: Clone Repository

```
# Clone the repository
# Navigate to project directory
```

## Step 2: Install Dependencies

```
# Install all workspace dependencies from root
```

## Step 3: Configure Environment

Create environment files for each package:

### Backend (.env)
```
TRYMINT_PORT=3000
TRYMINT_ENV=development
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/v1/auth/callback
JWT_SECRET=your-jwt-secret
SESSION_TTL=7200000
CREDENTIAL_TTL=900000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3000/v1
REACT_APP_WS_URL=ws://localhost:3000
```

## Step 4: Start Backend

```
# Navigate to backend directory
# Start development server
```

Expected output:
```
[INFO] TRYMINT Backend starting...
[INFO] Server running on port 3000
[INFO] WebSocket server ready
```

## Step 5: Start Frontend

```
# Navigate to frontend directory
# Start development server
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3001
```

## Step 6: Build Agent

```
# Navigate to agent directory
# Build CLI
# Link globally (optional)
```

## Step 7: Test the Flow

1. Open http://localhost:3001 in browser
2. Click "Sign in with Google"
3. Complete OAuth flow
4. Copy session token from UI
5. In terminal, run agent connect command with token
6. Enter a command in the UI
7. Review simulation results
8. Approve command
9. Watch execution output
10. Logout when done

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |

## Troubleshooting

### OAuth not working
- Verify Google Cloud Console credentials
- Check callback URL matches configuration
- Ensure localhost is in authorized origins

### Agent won't connect
- Verify backend is running
- Check token is correct
- Ensure WebSocket port is accessible

### Commands not executing
- Check agent is connected (status command)
- Verify directory capabilities
- Review simulation warnings

## Next Steps

- Read [Architecture Overview](../architecture/overview.md)
- Review [Security Model](../security/model.md)
- Explore [API Reference](../api/endpoints.md)
