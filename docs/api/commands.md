# Command Endpoints

> Command History API Reference

---

## GET /commands/history

Get command history for current session.

### Request

```
GET /commands/history
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 20 | Max results |
| offset | number | 0 | Pagination offset |
| status | string | all | Filter by status |

### Response

```json
{
  "success": true,
  "data": {
    "commands": [
      {
        "id": "cmd_123",
        "command": "ls -la",
        "status": "completed",
        "submittedAt": "2024-01-01T00:30:00Z",
        "simulatedAt": "2024-01-01T00:30:01Z",
        "approvedAt": "2024-01-01T00:30:05Z",
        "executedAt": "2024-01-01T00:30:06Z",
        "approved": true
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

## GET /commands/:id

Get specific command details.

### Request

```
GET /commands/cmd_123
Authorization: Bearer <token>
```

### Response

```json
{
  "success": true,
  "data": {
    "command": {
      "id": "cmd_123",
      "command": "ls -la",
      "status": "completed",
      "submittedAt": "2024-01-01T00:30:00Z",
      "simulatedAt": "2024-01-01T00:30:01Z",
      "approvedAt": "2024-01-01T00:30:05Z",
      "executedAt": "2024-01-01T00:30:06Z",
      "approved": true,
      "simulationResult": {
        "riskLevel": "low",
        "affectedPaths": [
          "/Users/user/projects"
        ],
        "preview": "... simulation preview ..."
      },
      "executionResult": {
        "exitCode": 0,
        "output": "... command output ..."
      }
    }
  }
}
```

---

## Command Status Values

| Status | Description |
|--------|-------------|
| `pending` | Command submitted, awaiting simulation |
| `simulating` | Simulation in progress |
| `awaiting_approval` | Simulation complete, awaiting user |
| `approved` | User approved, awaiting execution |
| `rejected` | User rejected command |
| `executing` | Execution in progress |
| `completed` | Execution completed |
| `failed` | Execution failed |
| `cancelled` | Command cancelled |

---

## 🔗 Related Documents

- [API Overview](overview.md)
- [WebSocket Events](../websocket/events.md)
