# Frontend – TRYMINT Web Application

> React-based web interface for the TRYMINT simulation-first execution platform

## Purpose

The frontend provides the user interface for:
- User authentication (Google OAuth)
- Session management
- Command simulation preview
- Approval workflow interface
- Real-time execution monitoring
- Terminal output display

## Folder Structure

```
frontend/
├── src/
│   ├── app/                    # Application entry and routing
│   ├── components/             # React components
│   │   ├── approval/           # Approval workflow components
│   │   ├── auth/               # Authentication components
│   │   ├── command/            # Command input components
│   │   ├── common/             # Shared UI components
│   │   ├── execution/          # Execution display components
│   │   ├── session/            # Session management components
│   │   └── simulation/         # Simulation preview components
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API and WebSocket services
│   ├── store/                  # State management
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── public/                     # Static assets
├── package.json                # Package configuration
└── README.md                   # This file
```

## File Map

### `/src/app/`
| File | Purpose |
|------|---------|
| `index.js` | Application entry point |
| `App.js` | Root component with routing |
| `routes.js` | Route definitions |

### `/src/components/approval/`
| File | Purpose |
|------|---------|
| `ApprovalDialog.js` | Modal for command approval |
| `ApprovalActions.js` | Approve/Reject buttons |
| `DiffViewer.js` | Shows simulation vs execution diff |

### `/src/components/auth/`
| File | Purpose |
|------|---------|
| `LoginButton.js` | Google OAuth login trigger |
| `LogoutButton.js` | Session termination trigger |
| `AuthGuard.js` | Protected route wrapper |
| `AuthCallback.js` | OAuth callback handler |

### `/src/components/command/`
| File | Purpose |
|------|---------|
| `CommandInput.js` | Command entry field |
| `CommandHistory.js` | Previous commands list |
| `CommandQueue.js` | Pending commands display |

### `/src/components/common/`
| File | Purpose |
|------|---------|
| `Button.js` | Reusable button component |
| `Modal.js` | Modal dialog wrapper |
| `Loading.js` | Loading spinner |
| `ErrorBoundary.js` | Error handling wrapper |
| `Layout.js` | Page layout component |

### `/src/components/execution/`
| File | Purpose |
|------|---------|
| `ExecutionPanel.js` | Main execution display |
| `TerminalOutput.js` | PTY output renderer |
| `ExecutionStatus.js` | Status indicator |
| `ExecutionLog.js` | Execution history log |

### `/src/components/session/`
| File | Purpose |
|------|---------|
| `SessionStatus.js` | Session state display |
| `SessionTimer.js` | Credential expiry countdown |
| `AgentConnection.js` | Agent connection status |
| `SessionControls.js` | Session management actions |

### `/src/components/simulation/`
| File | Purpose |
|------|---------|
| `SimulationPreview.js` | Simulation output display |
| `SimulationDiff.js` | Expected changes preview |
| `SimulationWarnings.js` | Risk/warning indicators |
| `SimulationActions.js` | Simulation control buttons |

### `/src/hooks/`
| File | Purpose |
|------|---------|
| `useAuth.js` | Authentication state hook |
| `useSession.js` | Session management hook |
| `useWebSocket.js` | WebSocket connection hook |
| `useSimulation.js` | Simulation state hook |
| `useExecution.js` | Execution state hook |
| `useApproval.js` | Approval workflow hook |

### `/src/services/`
| File | Purpose |
|------|---------|
| `api.js` | REST API client |
| `websocket.js` | WebSocket client |
| `auth.js` | Authentication service |
| `session.js` | Session service |
| `command.js` | Command service |

### `/src/store/`
| File | Purpose |
|------|---------|
| `index.js` | Store configuration |
| `authSlice.js` | Authentication state |
| `sessionSlice.js` | Session state |
| `commandSlice.js` | Command state |
| `simulationSlice.js` | Simulation state |
| `executionSlice.js` | Execution state |

### `/src/types/`
| File | Purpose |
|------|---------|
| `auth.js` | Authentication types |
| `session.js` | Session types |
| `command.js` | Command types |
| `websocket.js` | WebSocket message types |
| `api.js` | API response types |

### `/src/utils/`
| File | Purpose |
|------|---------|
| `constants.js` | Application constants |
| `helpers.js` | General helpers |
| `validators.js` | Input validation |
| `formatters.js` | Data formatters |
| `terminal.js` | Terminal output helpers |

## Component Hierarchy

```
App
├── AuthGuard
│   ├── Layout
│   │   ├── SessionStatus
│   │   ├── SessionTimer
│   │   └── AgentConnection
│   │
│   ├── CommandInput
│   │   └── CommandHistory
│   │
│   ├── SimulationPreview
│   │   ├── SimulationDiff
│   │   ├── SimulationWarnings
│   │   └── SimulationActions
│   │
│   ├── ApprovalDialog
│   │   ├── DiffViewer
│   │   └── ApprovalActions
│   │
│   └── ExecutionPanel
│       ├── TerminalOutput
│       ├── ExecutionStatus
│       └── ExecutionLog
│
└── AuthCallback
```

## State Flow

```
┌─────────────────────────────────────────────────────────┐
│                      Store                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  authSlice ──► sessionSlice ──► commandSlice           │
│                     │               │                   │
│                     ▼               ▼                   │
│              simulationSlice ──► executionSlice        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## WebSocket Events

The frontend subscribes to these WebSocket channels:
- `session:status` - Session state updates
- `simulation:result` - Simulation output
- `execution:output` - PTY stream data
- `execution:complete` - Execution finished
- `agent:status` - Agent connection state

## Security Considerations

- OAuth tokens stored securely (httpOnly cookies preferred)
- Short-lived session tokens
- Automatic session cleanup on logout
- No sensitive data in localStorage
- CSRF protection enabled
