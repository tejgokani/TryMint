# Agent CLI

> Command-line interface for the TRYMINT agent

## Purpose

Provides the command-line interface for users to interact with the agent. Handles argument parsing, user prompts, and terminal output.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | CLI entry point and commander setup |
| `commands.js` | CLI command definitions |
| `prompts.js` | Interactive user prompts |
| `output.js` | Terminal output formatting |

## Commands

### `trymint connect <token>`
Connect to the backend with a session token.

Options:
- `--server <url>` - Backend server URL
- `--silent` - Suppress output

### `trymint status`
Display current connection and session status.

Output includes:
- Connection state
- Session ID
- Credential expiry
- Allowed directories

### `trymint disconnect`
Disconnect from backend and clean up.

Actions:
- Close WebSocket
- Clear credentials
- Kill running processes

### `trymint version`
Display agent version information.

### `trymint help`
Display help information.

## Output Formatting

| Function | Purpose |
|----------|---------|
| `success(msg)` | Green success message |
| `error(msg)` | Red error message |
| `warn(msg)` | Yellow warning message |
| `info(msg)` | Blue info message |
| `progress(msg)` | Animated progress |
| `table(data)` | Formatted table |
