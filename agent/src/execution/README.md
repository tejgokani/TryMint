# Execution Directory

This directory contains PTY-based command execution.

## Structure

```
execution/
├── pty.ts               # PTY manager
├── executor.ts          # Command executor
├── stream.ts            # Output streaming
└── cleanup.ts           # Execution cleanup
```

## Component Descriptions

### pty.ts
PTY manager using node-pty.

**Responsibilities:**
- Create PTY instance
- Configure terminal dimensions
- Handle terminal resize
- Manage PTY lifecycle
- Clean up PTY resources

**Configuration:**
- Shell executable
- Initial dimensions
- Environment variables
- Working directory

### executor.ts
Command executor.

**Responsibilities:**
- Execute approved commands
- Manage execution state
- Handle command signals
- Track execution status
- Report completion

**States:**
- `PENDING` - Waiting to execute
- `RUNNING` - Currently executing
- `COMPLETED` - Finished successfully
- `FAILED` - Execution failed
- `CANCELLED` - User cancelled

### stream.ts
Output streaming.

**Responsibilities:**
- Capture PTY output
- Buffer output data
- Stream to backend
- Handle output encoding
- Manage flow control

**Streaming:**
- Real-time streaming
- Chunked transmission
- Backpressure handling

### cleanup.ts
Execution cleanup.

**Responsibilities:**
- Kill running processes
- Clean up PTY instances
- Remove temporary files
- Reset execution state
- Handle cleanup errors
