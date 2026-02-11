# Common Components

> Shared reusable UI components

## Purpose

Generic components used across multiple features. These are building blocks for the application UI.

## File Map

| File | Purpose |
|------|---------|
| `Button.js` | Reusable button with variants |
| `Modal.js` | Modal dialog wrapper |
| `Loading.js` | Loading spinner/skeleton |
| `ErrorBoundary.js` | React error boundary |
| `Layout.js` | Page layout with header/sidebar |
| `Card.js` | Content card container |
| `Badge.js` | Status badge component |
| `Tooltip.js` | Hover tooltip |
| `index.js` | Barrel export for all components |

## Component Details

### Button
- Variants: primary, secondary, danger
- States: loading, disabled
- Sizes: sm, md, lg

### Modal
- Overlay backdrop
- Close on escape
- Focus trap
- Portal rendering

### Loading
- Spinner variant
- Skeleton variant
- Full-page variant
- Inline variant

### ErrorBoundary
- Catches render errors
- Fallback UI display
- Error logging
- Recovery action

### Layout
- Header with session info
- Main content area
- Optional sidebar
- Footer

### Card
- Title slot
- Content slot
- Actions slot
- Variants: default, elevated

### Badge
- Colors: success, warning, error, info
- Pill or square shape
- Optional icon
