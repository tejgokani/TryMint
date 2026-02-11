# CLI Directory

This directory contains the command-line interface.

## Structure

```
cli/
├── index.ts             # CLI entry point
├── commands/            # CLI commands
│   ├── connect.ts       # Connect command
│   ├── disconnect.ts    # Disconnect command
│   ├── status.ts        # Status command
│   └── config.ts        # Config command
└── prompts.ts           # Interactive prompts
```

## Component Descriptions

### index.ts
CLI entry point and command routing.

**Responsibilities:**
- Parse command-line arguments
- Route to appropriate command
- Display help information
- Handle global options

### commands/connect.ts
Connect to backend server.

**Flow:**
1. Check for existing credentials
2. Prompt for credentials if needed
3. Establish WebSocket connection
4. Authenticate with backend
5. Start heartbeat
6. Enter daemon mode

### commands/disconnect.ts
Disconnect from backend.

**Flow:**
1. Send disconnect message
2. Close WebSocket connection
3. Clear session state
4. Exit daemon mode

### commands/status.ts
Display agent status.

**Output:**
- Connection status
- Session information
- Credential expiration
- Allowed directories

### commands/config.ts
Configure agent settings.

**Options:**
- Backend URL
- Credential storage location
- Log level
- Heartbeat interval

### prompts.ts
Interactive prompts.

**Prompts:**
- Credential input
- Confirmation dialogs
- Configuration options
