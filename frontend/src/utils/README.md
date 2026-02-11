# Utils Directory

> Utility functions and helpers

## Purpose

This directory contains shared utility functions, constants, validators, and formatters used throughout the frontend application.

## File Map

| File | Purpose |
|------|---------|
| `constants.js` | Application constants |
| `helpers.js` | General helper functions |
| `validators.js` | Input validation functions |
| `formatters.js` | Data formatting functions |
| `terminal.js` | Terminal output helpers |
| `index.js` | Barrel export for all utilities |

## File Details

### constants.js
- API URLs
- WebSocket endpoints
- Session timeout values
- Status codes
- Error messages

### helpers.js
- Deep clone
- Debounce/throttle
- Array utilities
- Object utilities
- Random ID generation

### validators.js
- Command validation
- Input sanitization
- Path validation
- Email validation

### formatters.js
- Date formatting
- Duration formatting
- Byte size formatting
- Truncation helpers

### terminal.js
- ANSI code parsing
- Line buffer management
- Color code conversion
- Output sanitization

## Usage

All utilities are exported from index.js:

```javascript
import { formatDate, validateCommand, TIMEOUT } from '../utils';
```
