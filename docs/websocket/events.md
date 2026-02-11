# WebSocket Events Reference

> Complete WebSocket event documentation

## Message Format

All WebSocket messages follow this structure:

```json
{
  "type": "category:event",
  "payload": {},
  "timestamp": 1707667200000,
  "id": "msg-uuid-v4"
}
```

## Server → Client Events

### Session Events

#### `session:connected`
Session established successfully.
```json
{
  "type": "session:connected",
  "payload": {
    "sessionId": "sess-abc123",
    "expiresAt": 1707670800000
  }
}
```

#### `session:status`
Session state changed.
```json
{
  "type": "session:status",
  "payload": {
    "status": "active",
    "agentConnected": true
  }
}
```

#### `session:expiring`
Credentials expiring soon.
```json
{
  "type": "session:expiring",
  "payload": {
    "expiresIn": 300,
    "canRefresh": true
  }
}
```

### Simulation Events

#### `simulation:started`
Simulation has begun.
```json
{
  "type": "simulation:started",
  "payload": {
    "commandId": "cmd-abc123",
    "command": "ls -la"
  }
}
```

#### `simulation:result`
Simulation completed.
```json
{
  "type": "simulation:result",
  "payload": {
    "commandId": "cmd-abc123",
    "success": true,
    "riskLevel": "LOW",
    "effects": [],
    "warnings": [],
    "canExecute": true
  }
}
```

#### `simulation:failed`
Simulation failed.
```json
{
  "type": "simulation:failed",
  "payload": {
    "commandId": "cmd-abc123",
    "error": "Capability violation",
    "violations": ["/etc/passwd"]
  }
}
```

### Execution Events

#### `execution:started`
Execution has begun.
```json
{
  "type": "execution:started",
  "payload": {
    "commandId": "cmd-abc123",
    "command": "ls -la"
  }
}
```

#### `execution:output`
PTY output chunk.
```json
{
  "type": "execution:output",
  "payload": {
    "commandId": "cmd-abc123",
    "data": "file1.txt\nfile2.txt\n",
    "stream": "stdout"
  }
}
```

#### `execution:complete`
Execution finished.
```json
{
  "type": "execution:complete",
  "payload": {
    "commandId": "cmd-abc123",
    "exitCode": 0,
    "duration": 150
  }
}
```

### Agent Events

#### `agent:connected`
Agent came online.
```json
{
  "type": "agent:connected",
  "payload": {
    "agentId": "agent-abc123",
    "version": "1.0.0",
    "capabilities": ["/home/user/project"]
  }
}
```

#### `agent:disconnected`
Agent went offline.
```json
{
  "type": "agent:disconnected",
  "payload": {
    "agentId": "agent-abc123",
    "reason": "heartbeat_timeout"
  }
}
```

---

## Client → Server Events

#### `command:submit`
Submit command for simulation.
```json
{
  "type": "command:submit",
  "payload": {
    "command": "ls -la",
    "workingDir": "/home/user/project"
  }
}
```

#### `command:approve`
Approve simulated command.
```json
{
  "type": "command:approve",
  "payload": {
    "commandId": "cmd-abc123"
  }
}
```

#### `command:reject`
Reject simulated command.
```json
{
  "type": "command:reject",
  "payload": {
    "commandId": "cmd-abc123",
    "reason": "user_rejected"
  }
}
```

#### `execution:cancel`
Cancel running execution.
```json
{
  "type": "execution:cancel",
  "payload": {
    "commandId": "cmd-abc123"
  }
}
```

#### `session:refresh`
Request credential refresh.
```json
{
  "type": "session:refresh",
  "payload": {}
}
```

---

## Agent → Server Events

#### `agent:register`
Agent registration.
```json
{
  "type": "agent:register",
  "payload": {
    "token": "credential-token",
    "version": "1.0.0",
    "os": "darwin",
    "arch": "x64"
  }
}
```

#### `agent:heartbeat`
Agent heartbeat.
```json
{
  "type": "agent:heartbeat",
  "payload": {
    "status": "idle",
    "memoryUsage": 50000000
  }
}
```

#### `simulation:result`
Simulation result from agent.
```json
{
  "type": "simulation:result",
  "payload": {
    "commandId": "cmd-abc123",
    "result": {}
  }
}
```

#### `execution:output`
Execution output from agent.
```json
{
  "type": "execution:output",
  "payload": {
    "commandId": "cmd-abc123",
    "data": "output chunk"
  }
}
```

#### `execution:complete`
Execution complete from agent.
```json
{
  "type": "execution:complete",
  "payload": {
    "commandId": "cmd-abc123",
    "exitCode": 0
  }
}
```
