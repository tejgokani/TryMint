# Frontend Source - App Directory

> Application entry point and routing configuration

## Purpose

This directory contains the main application setup including:
- React application entry point
- Root component configuration
- Route definitions
- Provider wrappers

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Application bootstrap and ReactDOM render |
| `App.js` | Root component with provider wrappers |
| `routes.js` | Route configuration and definitions |

## Responsibilities

1. **Application Bootstrap**
   - Initialize React application
   - Mount to DOM
   - Configure hot reloading (dev)

2. **Provider Setup**
   - State management provider
   - Authentication provider
   - WebSocket provider
   - Theme provider

3. **Routing**
   - Define protected routes
   - Define public routes
   - Handle OAuth callback route
   - 404 handling

## Route Structure

```
/                   → Dashboard (protected)
/login              → Login page (public)
/auth/callback      → OAuth callback handler
/session            → Session management (protected)
/history            → Command history (protected)
```
