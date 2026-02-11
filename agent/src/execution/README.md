# Agent Execution

> Command execution with PTY streaming

## Purpose

Handles the actual execution of approved commands using node-pty. Manages PTY sessions, streams output, handles signals, and reports results.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Execution coordinator |
| `pty.js` | PTY session management |
| `stream.js` | Output streaming to backend |
| `lifecycle.js` | Execution lifecycle management |

## PTY Management (pty.js)

| Function | Purpose |
|----------|---------|
| `spawn(command, options)` | Spawn PTY process |
| `write(data)` | Write to PTY stdin |
| `resize(cols, rows)` | Resize PTY |
| `kill(signal)` | Kill PTY process |
| `onData(callback)` | Register data handler |
| `onExit(callback)` | Register exit handler |

## Execution Flow

```
1. Receive execute command
         │
         ▼
2. Validate against capabilities
         │
         ▼
3. Spawn PTY with command
         │
         ▼
4. Stream output to backend
         │
         ▼
5. Handle exit/signal
         │
         ▼
6. Report completion
```

## Streaming (stream.js)

| Function | Purpose |
|----------|---------|
| `createStream(executionId)` | Create output stream |
| `write(chunk)` | Buffer and send chunk |
| `flush()` | Force send buffered data |
| `end(exitCode)` | End stream with result |

Stream characteristics:
- Buffer small chunks for efficiency
- Flush on newline or timeout (100ms)
- Handle backpressure
- UTF-8 encoding

## Lifecycle (lifecycle.js)

| Function | Purpose |
|----------|---------|
| `start(executionId)` | Mark execution started |
| `running(pid)` | Track running process |
| `complete(exitCode)` | Mark completed |
| `failed(error)` | Mark failed |
| `cancel()` | Cancel execution |
| `cleanup()` | Clean up resources |

## Execution States

```
PENDING → STARTING → RUNNING → COMPLETED
                        │           │
                        ▼           │
                     CANCELLED      │
                        │           │
                        ▼           ▼
                     FAILED ◄───────┘
```

## Signal Handling

| Signal | Action |
|--------|--------|
| SIGTERM | Graceful shutdown |
| SIGKILL | Force kill |
| SIGINT | Interrupt (Ctrl+C forward) |
| SIGHUP | Hangup handling |

## Resource Limits

- Max execution time: configurable (default 5 min)
- Max output buffer: 10MB
- Max concurrent: 1 (sequential execution)
