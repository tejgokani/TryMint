# Execution Components

> UI components for real-time command execution display

## Purpose

These components handle the display of real-time command execution, including PTY output streaming, status indicators, and execution logs.

## File Map

| File | Purpose |
|------|---------|
| `ExecutionPanel.js` | Main execution display container |
| `TerminalOutput.js` | PTY stream renderer |
| `ExecutionStatus.js` | Status indicator (running/done/error) |
| `ExecutionLog.js` | Execution history log |
| `index.js` | Barrel export for all components |

## Component Details

### ExecutionPanel
- Container for execution UI
- Manages terminal instance
- Controls execution lifecycle
- Stop/Cancel actions

### TerminalOutput
- Renders PTY output
- ANSI color support
- Auto-scroll behavior
- Copy output action
- Line wrapping

### ExecutionStatus
- Visual status indicator
- States: idle, running, success, error
- Animated running state
- Exit code display

### ExecutionLog
- List of past executions
- Timestamp and duration
- Expandable output
- Status filtering

## Real-time Updates

Components receive updates via WebSocket:
- `execution:output` → TerminalOutput
- `execution:status` → ExecutionStatus
- `execution:complete` → ExecutionPanel
