# Components Directory

This directory contains all reusable React components organized by feature domain.

## Structure

```
components/
├── auth/                    # Authentication components
│   ├── LoginButton.tsx      # Google OAuth login button
│   ├── LogoutButton.tsx     # Logout/teardown button
│   ├── AuthGuard.tsx        # Route protection wrapper
│   └── SessionExpiry.tsx    # Session expiration warning
├── command/                 # Command-related components
│   ├── CommandInput.tsx     # Command input field
│   ├── CommandHistory.tsx   # Historical command list
│   ├── CommandStatus.tsx    # Execution status indicator
│   └── CommandCard.tsx      # Individual command display
├── simulation/              # Simulation display components
│   ├── SimulationPanel.tsx  # Main simulation container
│   ├── SimulationDiff.tsx   # Before/after comparison
│   ├── RiskIndicator.tsx    # Risk level display
│   └── AffectedFiles.tsx    # Files affected listing
├── approval/                # Approval workflow components
│   ├── ApprovalModal.tsx    # Approval confirmation dialog
│   ├── ApprovalButtons.tsx  # Approve/Reject buttons
│   └── ApprovalHistory.tsx  # Past approvals listing
├── session/                 # Session management components
│   ├── SessionCard.tsx      # Active session display
│   ├── SessionList.tsx      # All sessions listing
│   ├── SessionTimer.tsx     # Time remaining display
│   └── AgentStatus.tsx      # Connected agent status
├── terminal/                # Terminal display components
│   ├── TerminalWindow.tsx   # PTY output display
│   ├── TerminalHeader.tsx   # Terminal title bar
│   └── OutputStream.tsx     # Real-time output streaming
└── ui/                      # Base UI components
    ├── Button.tsx           # Button component
    ├── Input.tsx            # Input field component
    ├── Modal.tsx            # Modal dialog component
    ├── Card.tsx             # Card container component
    ├── Badge.tsx            # Status badge component
    ├── Spinner.tsx          # Loading spinner
    ├── Toast.tsx            # Notification toast
    └── index.ts             # UI component exports
```

## Conventions

- One component per file
- Component name matches filename
- Props interface defined in same file
- Use TypeScript for all components
- Export from index.ts for clean imports
