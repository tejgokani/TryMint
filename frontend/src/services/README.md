# Services Directory

> API clients and external service integrations

## Purpose

This directory contains service modules that handle communication with the backend API, WebSocket connections, and authentication providers.

## File Map

| File | Purpose |
|------|---------|
| `api.js` | REST API client configuration |
| `websocket.js` | WebSocket client manager |
| `auth.js` | Authentication service |
| `session.js` | Session management service |
| `command.js` | Command submission service |
| `index.js` | Barrel export for all services |

## Service Details

### api.js
- Base HTTP client configuration
- Request/response interceptors
- Error handling
- Auth header injection
- Base URL configuration

### websocket.js
- WebSocket connection management
- Auto-reconnection logic
- Message queuing
- Event subscription system
- Heartbeat handling

### auth.js
- OAuth flow initiation
- Token exchange
- Token refresh
- Logout handling
- User info retrieval

### session.js
- Session creation
- Session validation
- Session termination
- Credential refresh
- Session state queries

### command.js
- Command submission
- Simulation requests
- Execution requests
- Command history fetch
- Command cancellation

## API Endpoints Used

| Service | Endpoints |
|---------|-----------|
| auth | `/auth/google`, `/auth/callback`, `/auth/logout` |
| session | `/session`, `/session/refresh`, `/session/terminate` |
| command | `/command/simulate`, `/command/execute`, `/command/history` |

## WebSocket Channels

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `session:*` | Server→Client | Session state updates |
| `simulation:*` | Server→Client | Simulation results |
| `execution:*` | Bidirectional | Execution stream |
| `agent:*` | Server→Client | Agent status |
