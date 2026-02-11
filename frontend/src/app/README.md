# App Directory (Next.js App Router)

This directory contains all route-based page components using Next.js 13+ App Router.

## Structure

```
app/
├── (auth)/              # Authentication route group
│   ├── login/           # Login page
│   │   └── page.tsx     # OAuth login initiation
│   ├── callback/        # OAuth callback handling
│   │   └── page.tsx     # Process OAuth response
│   └── logout/          # Logout page
│       └── page.tsx     # Session teardown confirmation
├── (dashboard)/         # Protected dashboard routes
│   ├── layout.tsx       # Dashboard layout with auth guard
│   ├── page.tsx         # Main dashboard
│   ├── commands/        # Command management
│   │   └── page.tsx     # Command history and execution
│   ├── sessions/        # Session management
│   │   └── page.tsx     # Active sessions display
│   └── settings/        # User settings
│       └── page.tsx     # Configuration options
├── api/                 # API routes (if needed)
├── layout.tsx           # Root layout
├── page.tsx             # Landing/home page
├── loading.tsx          # Global loading state
├── error.tsx            # Global error boundary
└── not-found.tsx        # 404 page
```

## Route Groups

### (auth)
Public routes for authentication flow. No authentication required.

### (dashboard)
Protected routes requiring valid session. Wrapped with auth guard.

## Conventions

- Each route has its own `page.tsx`
- Shared layouts use `layout.tsx`
- Loading states use `loading.tsx`
- Error handling uses `error.tsx`
