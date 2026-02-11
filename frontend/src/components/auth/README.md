# Authentication Components

> UI components for Google OAuth authentication flow

## Purpose

These components handle user authentication including login, logout, OAuth callbacks, and route protection.

## File Map

| File | Purpose |
|------|---------|
| `LoginButton.js` | Initiates Google OAuth flow |
| `LogoutButton.js` | Terminates session with teardown |
| `AuthGuard.js` | HOC for protected route access |
| `AuthCallback.js` | Handles OAuth redirect callback |
| `index.js` | Barrel export for all components |

## Component Details

### LoginButton
- Displays "Sign in with Google" button
- Redirects to OAuth provider
- Shows loading state during auth

### LogoutButton
- Initiates mandatory logout teardown
- Clears local session data
- Redirects to login page

### AuthGuard
- Wraps protected routes
- Checks authentication state
- Redirects unauthenticated users
- Shows loading during auth check

### AuthCallback
- Receives OAuth callback
- Exchanges code for tokens
- Handles auth errors
- Redirects to dashboard on success

## Security Notes

- Tokens are NOT stored in localStorage
- Uses httpOnly cookies when possible
- Session binding verification required
- PKCE flow for OAuth
