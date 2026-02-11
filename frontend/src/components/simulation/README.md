# Simulation Components

> UI components for command simulation preview

## Purpose

These components display simulation results, expected changes, warnings, and simulation controls. This is the "Try Before You Mint" preview interface.

## File Map

| File | Purpose |
|------|---------|
| `SimulationPreview.js` | Main simulation output display |
| `SimulationDiff.js` | Expected changes preview |
| `SimulationWarnings.js` | Risk/warning indicators |
| `SimulationActions.js` | Simulation control buttons |
| `index.js` | Barrel export for all components |

## Component Details

### SimulationPreview
- Displays simulated output
- Read-only terminal view
- Syntax highlighting
- Expandable sections

### SimulationDiff
- Shows expected file changes
- Before/after comparison
- Addition/deletion highlights
- Affected paths list

### SimulationWarnings
- Risk level indicator (low/medium/high)
- Warning messages list
- Destructive action alerts
- Permission warnings

### SimulationActions
- "Proceed to Approval" button
- "Re-simulate" button
- "Cancel" button
- "Modify Command" button

## Risk Levels

| Level | Color | Description |
|-------|-------|-------------|
| LOW | Green | Safe operation |
| MEDIUM | Yellow | Review recommended |
| HIGH | Red | Destructive potential |
| CRITICAL | Red + Icon | System-affecting |

## Simulation States

```
IDLE → SIMULATING → COMPLETED → READY_FOR_APPROVAL
                        ↓
                    FAILED
```
