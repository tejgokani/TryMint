# Approval Components

> UI components for the command approval workflow

## Purpose

These components handle the approval step between simulation and execution. They display simulation results and allow users to approve or reject command execution.

## File Map

| File | Purpose |
|------|---------|
| `ApprovalDialog.js` | Modal dialog for approval decision |
| `ApprovalActions.js` | Approve/Reject button group |
| `DiffViewer.js` | Side-by-side comparison of changes |
| `index.js` | Barrel export for all components |

## Component Details

### ApprovalDialog
- Displays simulation results
- Shows expected file/system changes
- Contains approve/reject actions
- Blocking modal (must take action)

### ApprovalActions
- Approve button (green)
- Reject button (red)
- Optional "Simulate Again" action
- Disabled state handling

### DiffViewer
- Shows before/after state
- Highlights changes
- Supports file diff format
- Collapsible sections
