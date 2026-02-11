# Agent Simulation

> Command simulation and effect prediction

## Purpose

Simulates commands without executing them. Parses commands, predicts effects, validates safety, and returns simulation results for user approval.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Simulation coordinator |
| `parser.js` | Command parser |
| `predictor.js` | Effect prediction |
| `validator.js` | Safety validation |

## Simulation Flow

```
Command Input
      │
      ▼
┌──────────┐
│  Parser  │ → Parse command structure
└──────────┘
      │
      ▼
┌──────────┐
│ Predictor│ → Predict file/system effects
└──────────┘
      │
      ▼
┌──────────┐
│ Validator│ → Check safety and capabilities
└──────────┘
      │
      ▼
Simulation Result
```

## Command Parser (parser.js)

| Function | Purpose |
|----------|---------|
| `parse(command)` | Parse command into AST |
| `extractCommand(parsed)` | Get primary command |
| `extractArgs(parsed)` | Get arguments |
| `extractPaths(parsed)` | Get file paths |
| `detectPipes(parsed)` | Find piped commands |
| `detectRedirects(parsed)` | Find redirections |

## Effect Predictor (predictor.js)

| Function | Purpose |
|----------|---------|
| `predict(parsed)` | Predict all effects |
| `predictFileChanges(parsed)` | Predict file modifications |
| `predictCreations(parsed)` | Predict file creations |
| `predictDeletions(parsed)` | Predict file deletions |
| `predictPermissionChanges(parsed)` | Predict permission changes |

### Prediction Categories

| Category | Examples |
|----------|----------|
| FILE_READ | cat, less, head |
| FILE_WRITE | echo >, tee |
| FILE_CREATE | touch, mkdir |
| FILE_DELETE | rm, rmdir |
| FILE_MOVE | mv |
| FILE_COPY | cp |
| PERMISSION_CHANGE | chmod, chown |
| NETWORK | curl, wget |
| PROCESS | kill, pkill |

## Safety Validator (validator.js)

| Function | Purpose |
|----------|---------|
| `validate(parsed, capabilities)` | Full validation |
| `checkCapabilities(paths, caps)` | Capability check |
| `checkDangerousPatterns(command)` | Pattern check |
| `calculateRiskLevel(parsed)` | Risk assessment |
| `generateWarnings(parsed)` | Generate warnings |

### Risk Levels

| Level | Criteria |
|-------|----------|
| LOW | Read-only operations |
| MEDIUM | File modifications in allowed dirs |
| HIGH | Deletions, permission changes |
| CRITICAL | System commands, network access |

## Simulation Result

```
SimulationResult {
  success: boolean
  command: string
  parsed: ParsedCommand
  effects: Effect[]
  warnings: Warning[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  violations: Violation[]
  canExecute: boolean
}
```

## Dangerous Pattern Detection

- `rm -rf /`
- `chmod 777`
- `:(){:|:&};:` (fork bomb)
- `> /dev/sda`
- `dd if=/dev/zero`
- Command substitution with dangerous commands
