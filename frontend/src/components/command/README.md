# Command Components

> UI components for command input and management

## Purpose

These components handle command entry, history display, and command queue management.

## File Map

| File | Purpose |
|------|---------|
| `CommandInput.js` | Main command entry field |
| `CommandHistory.js` | Previous commands list |
| `CommandQueue.js` | Pending commands display |
| `index.js` | Barrel export for all components |

## Component Details

### CommandInput
- Text input for commands
- Submit on Enter
- Validation before submission
- Disabled when execution in progress

### CommandHistory
- List of previous commands
- Status indicators (simulated/executed)
- Click to re-run command
- Filterable/searchable

### CommandQueue
- Shows pending simulations
- Shows pending approvals
- Cancellable queue items
- Priority ordering
