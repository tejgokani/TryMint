# Frontend

> TRYMINT Web Application

---

## 📋 Overview

The frontend package provides the web-based user interface for TRYMINT. Built with React/Next.js, it handles user authentication, command visualization, simulation result display, and the approval workflow.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│  Pages          │  Route-based page components          │
│  Components     │  Reusable UI components               │
│  Hooks          │  Custom React hooks                   │
│  Services       │  API and WebSocket clients            │
│  Store          │  State management                     │
│  Types          │  TypeScript definitions               │
│  Utils          │  Helper functions                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (dashboard)/     # Protected dashboard routes
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Landing page
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components
│   │   ├── command/         # Command input/display
│   │   ├── simulation/      # Simulation result display
│   │   ├── approval/        # Approval workflow UI
│   │   ├── session/         # Session management UI
│   │   ├── terminal/        # PTY terminal display
│   │   └── ui/              # Base UI components
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useSession.ts    # Session management
│   │   ├── useWebSocket.ts  # WebSocket connection
│   │   └── useCommand.ts    # Command execution
│   ├── services/            # External service clients
│   │   ├── api.ts           # REST API client
│   │   ├── websocket.ts     # WebSocket client
│   │   └── auth.ts          # Auth service
│   ├── store/               # State management
│   │   ├── auth.ts          # Auth state
│   │   ├── session.ts       # Session state
│   │   └── command.ts       # Command state
│   ├── types/               # TypeScript definitions
│   │   ├── auth.ts          # Auth types
│   │   ├── session.ts       # Session types
│   │   ├── command.ts       # Command types
│   │   └── websocket.ts     # WebSocket message types
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Input validation
│   │   ├── formatting.ts    # Display formatting
│   │   └── constants.ts     # Application constants
│   └── styles/              # Global styles
│       └── globals.css      # Global CSS
├── public/                  # Static assets
│   ├── icons/               # Application icons
│   └── images/              # Static images
├── package.json             # Package configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md                # This file
```

---

## 🔑 Key Responsibilities

### Authentication Flow
- Initiate Google OAuth login
- Handle OAuth callback
- Store and refresh tokens
- Display authentication state

### Session Management
- Display active sessions
- Show session expiration
- Handle session refresh
- Trigger logout/teardown

### Command Interface
- Accept command input
- Display command history
- Show execution status
- Stream PTY output

### Simulation Display
- Render simulation results
- Highlight potential changes
- Show risk assessment
- Display affected resources

### Approval Workflow
- Present approval dialog
- Capture user decision
- Send approval/rejection
- Confirm execution

---

## 🔌 Service Integration

### REST API
- `POST /auth/login` - Initiate OAuth
- `POST /auth/logout` - Session teardown
- `GET /session/status` - Session info
- `GET /commands/history` - Command history

### WebSocket Events
- `session:connected` - Connection established
- `command:simulate` - Send for simulation
- `simulation:result` - Receive results
- `command:approve` - Approve execution
- `command:output` - Stream execution output

---

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

---

## 📄 Configuration

See `.env.example` in the root directory for required environment variables.
