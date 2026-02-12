# Risk Engine API – Response Structure

> Backend-only changes. Frontend should adapt to these response shapes.

## Simulation Result (WebSocket `simulation:result` & REST `POST /command/simulate`)

### New Response Structure

```json
{
  "success": true,
  "commandId": "cmd-xxx",
  "finalScore": 42,
  "riskLevel": "MEDIUM",
  "destructiveness": 35,
  "privilege": 60,
  "dependencyRisk": 45,
  "networkRisk": 20,
  "behavioralRisk": 0,
  "triggers": [
    "Privilege: chmod - change permissions",
    "Recursive operation flag (-r, -R, --recursive)"
  ],
  "analysisSteps": [
    {
      "section": "File system",
      "steps": [
        {
          "check": "Path extraction",
          "data": { "paths": ["/tmp"], "count": 1 },
          "result": "Found 1 path(s) in command"
        }
      ]
    },
    {
      "section": "Final score",
      "steps": [
        {
          "check": "Formula: FRS = 0.30*D + 0.25*P + 0.20*R + 0.15*N + 0.10*B",
          "data": { "D": 35, "P": 60, "R": 45, "N": 20, "B": 0 },
          "result": "Final: 42 (MEDIUM)"
        }
      ]
    }
  ],
  "effects": [
    { "type": "RECURSIVE_DESTRUCTIVE", "target": 50 },
    { "type": "NETWORK_REQUEST", "target": "registry.npmjs.org" }
  ],
  "warnings": [
    "Recursive operation on filesystem",
    "Package has install scripts that run during installation"
  ],
  "canExecute": true
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `finalScore` | number | 0–100, computed from weighted formula |
| `riskLevel` | string | `LOW` \| `MEDIUM` \| `HIGH` |
| `destructiveness` | number | 0–100, file system impact |
| `privilege` | number | 0–100, privilege escalation risk |
| `dependencyRisk` | number | 0–100, package install risk |
| `networkRisk` | number | 0–100, network/remote execution risk |
| `behavioralRisk` | number | 0–100, suspicious patterns |
| `triggers` | string[] | List of detected risk triggers |
| `analysisSteps` | object[] | Per-section analysis details |
| `effects` | object[] | `{ type, target }` |
| `warnings` | string[] | Human-readable warnings |
| `canExecute` | boolean | `false` when `riskLevel === 'HIGH'` |

### Backward Compatibility

- `riskLevel`, `effects`, `warnings`, `canExecute` are unchanged.
- `finalScore` replaces derived score from `riskLevel`.
- Frontend can use `finalScore` instead of mapping `riskLevel` to a score.

---

## Execution Result (Command History)

### Execution Steps

Commands now include `executionSteps`:

```json
{
  "id": "cmd-xxx",
  "command": "npm install express",
  "status": "COMPLETED",
  "executionResult": {
    "exitCode": 0,
    "duration": 1234,
    "executionSteps": [
      { "phase": "SUBMITTED", "timestamp": 1707667200000, "status": "pending" },
      { "phase": "SIMULATED", "timestamp": 1707667201000, "status": "complete", "riskLevel": "LOW" },
      { "phase": "APPROVED", "timestamp": 1707667202000, "status": "complete" },
      { "phase": "EXECUTING", "timestamp": 1707667203000, "status": "started" },
      { "phase": "COMPLETED", "timestamp": 1707667204234, "status": "complete", "exitCode": 0, "duration": 1234 }
    ]
  }
}
```

### Phases

| Phase | Description |
|-------|-------------|
| `SUBMITTED` | Command created |
| `SIMULATED` | Risk evaluation completed |
| `APPROVED` | User approved execution |
| `EXECUTING` | Agent started execution |
| `COMPLETED` | Success, includes `exitCode`, `duration` |
| `FAILED` | Execution failed |

---

## Risk Formula

```
FRS = (0.25 × D) + (0.25 × P) + (0.20 × R) + (0.15 × N) + (0.15 × B)
D=destructiveness, P=privilege, R=dependencyRisk, N=networkRisk, B=behavioralRisk (includes source code)
```

- **D** = destructiveness (file system)
- **P** = privilege
- **R** = dependency risk (package installs)
- **N** = network risk
- **B** = behavioral risk

---

## Constraints

- No command execution during simulation.
- No shell spawning in backend.
- No filesystem access to user paths.
- Package metadata comes from npm registry (real API).
- If registry fetch fails, `dependencyRisk` is marked accordingly; no mock values.
