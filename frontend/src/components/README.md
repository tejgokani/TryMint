# Frontend Components Directory

> Reusable React components organized by feature domain

## Purpose

This directory contains all React components organized into feature-based subdirectories. Each subdirectory groups related components for a specific domain of the application.

## Structure

```
components/
├── approval/       # Command approval workflow UI
├── auth/           # Authentication components
├── command/        # Command input and management
├── common/         # Shared/reusable components
├── execution/      # Command execution display
├── session/        # Session management UI
└── simulation/     # Simulation preview components
```

## Subdirectory Overview

### `approval/`
Components for the approval step in the Simulate → Approve → Execute workflow.
- Approval dialogs
- Diff viewers
- Approve/Reject actions

### `auth/`
Authentication-related components.
- Login/Logout buttons
- OAuth callback handling
- Route protection (AuthGuard)

### `command/`
Command input and history components.
- Command text input
- Command history list
- Command queue display

### `common/`
Shared components used across features.
- Buttons, modals, spinners
- Layout components
- Error boundaries

### `execution/`
Real-time execution display components.
- Terminal output renderer
- Execution status indicators
- Execution logs

### `session/`
Session management UI components.
- Session status display
- Credential timer
- Agent connection indicator

### `simulation/`
Simulation preview and review components.
- Simulation output preview
- Expected changes diff
- Warning indicators

## Component Guidelines

1. **Single Responsibility** - Each component should do one thing well
2. **Props Over State** - Prefer props for data, minimize local state
3. **Hooks for Logic** - Extract business logic to custom hooks
4. **Consistent Naming** - PascalCase for components, camelCase for files
