# Agent Documentation

> Local CLI agent architecture and usage

## Purpose

Documents the agent architecture, CLI usage, execution model, and security responsibilities.

## File Map

| File | Purpose |
|------|---------|
| `overview.md` | Agent overview |
| `cli.md` | CLI usage guide |
| `architecture.md` | Agent architecture |
| `execution.md` | Execution model |
| `security.md` | Agent security |
| `troubleshooting.md` | Common issues |

## Overview (overview.md)

Contents:
- What is the agent
- Agent responsibilities
- Agent capabilities
- System requirements

## CLI (cli.md)

Command reference:
```
trymint connect <token>    # Connect to backend
trymint status             # Show status
trymint disconnect         # Disconnect
trymint version            # Show version
trymint help               # Show help
```

Options and flags for each command.

## Architecture (architecture.md)

Agent components:
- CLI interface
- Connection manager
- Credential manager
- Simulation engine
- Execution engine
- Isolation enforcer

Component interaction diagram.

## Execution (execution.md)

Execution flow:
1. Receive command from backend
2. Validate against capabilities
3. Spawn PTY session
4. Stream output to backend
5. Report completion

PTY details:
- node-pty integration
- Signal handling
- Output buffering
- Exit code handling

## Security (security.md)

Agent security responsibilities:
- Credential validation
- Capability enforcement
- Path validation
- Command sanitization
- Process isolation

## Troubleshooting (troubleshooting.md)

Common issues:
- Connection failures
- Authentication errors
- Capability violations
- Execution timeouts
- PTY issues
