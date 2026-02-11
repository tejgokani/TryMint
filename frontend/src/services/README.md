# Services Directory

This directory contains external service clients and API integrations.

## Structure

```
services/
├── api.ts               # REST API client
├── websocket.ts         # WebSocket client
├── auth.ts              # Authentication service
└── index.ts             # Service exports
```

## Service Descriptions

### api.ts
HTTP client for REST API communication.

**Responsibilities:**
- Configure base URL and headers
- Handle request/response interceptors
- Manage authentication tokens
- Implement retry logic
- Handle error responses

**Endpoints:**
- Authentication endpoints
- Session management endpoints
- Command history endpoints
- Configuration endpoints

### websocket.ts
WebSocket client for real-time communication.

**Responsibilities:**
- Establish secure connection
- Handle authentication handshake
- Manage message serialization
- Implement heartbeat/ping-pong
- Handle reconnection strategy
- Dispatch incoming messages

**Channels:**
- Session channel
- Command channel
- Simulation channel
- Terminal output channel

### auth.ts
Authentication service wrapper.

**Responsibilities:**
- Initiate OAuth flow
- Handle token storage
- Refresh expired tokens
- Clear credentials on logout
- Validate token status
