# Utils Directory

This directory contains utility functions and constants.

## Structure

```
utils/
├── validation.ts        # Input validation utilities
├── formatting.ts        # Display formatting helpers
├── constants.ts         # Application constants
├── crypto.ts            # Cryptographic utilities
├── storage.ts           # Local storage helpers
├── time.ts              # Time/date utilities
└── index.ts             # Utility exports
```

## Utility Descriptions

### validation.ts
Input validation and sanitization.

- `validateCommand()` - Validate command input
- `sanitizeInput()` - Sanitize user input
- `isValidPath()` - Validate file paths
- `validateSessionToken()` - Token format validation

### formatting.ts
Display formatting helpers.

- `formatTimestamp()` - Format date/time
- `formatDuration()` - Format time duration
- `formatFileSize()` - Format byte sizes
- `formatCommandOutput()` - Format terminal output
- `truncateText()` - Truncate with ellipsis

### constants.ts
Application-wide constants.

- `API_ENDPOINTS` - API route constants
- `WS_EVENTS` - WebSocket event names
- `SESSION_CONFIG` - Session configuration
- `UI_CONFIG` - UI configuration
- `ERROR_MESSAGES` - Error message strings

### crypto.ts
Cryptographic utilities.

- `hashToken()` - Hash sensitive data
- `generateNonce()` - Generate random nonce

### storage.ts
Local storage management.

- `getStoredToken()` - Retrieve token
- `setStoredToken()` - Store token
- `clearStorage()` - Clear all stored data

### time.ts
Time and date utilities.

- `isExpired()` - Check expiration
- `getTimeRemaining()` - Calculate remaining time
- `formatRelativeTime()` - Relative time display
