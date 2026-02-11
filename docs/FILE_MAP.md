# TRYMINT File Map

> Complete file structure reference

This document provides the complete file map for all folders in the TRYMINT monorepo.

## Root Level

```
trymint/
├── frontend/
├── backend/
├── agent/
├── docs/
├── package.json          # Workspace configuration
├── .gitignore            # Git ignore rules
└── README.md             # Project overview
```

---

## Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── index.js              # Application entry point
│   │   ├── App.js                # Root component
│   │   └── routes.js             # Route definitions
│   │
│   ├── components/
│   │   ├── approval/
│   │   │   ├── ApprovalDialog.js
│   │   │   ├── ApprovalActions.js
│   │   │   ├── DiffViewer.js
│   │   │   └── index.js
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginButton.js
│   │   │   ├── LogoutButton.js
│   │   │   ├── AuthGuard.js
│   │   │   ├── AuthCallback.js
│   │   │   └── index.js
│   │   │
│   │   ├── command/
│   │   │   ├── CommandInput.js
│   │   │   ├── CommandHistory.js
│   │   │   ├── CommandQueue.js
│   │   │   └── index.js
│   │   │
│   │   ├── common/
│   │   │   ├── Button.js
│   │   │   ├── Modal.js
│   │   │   ├── Loading.js
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── Layout.js
│   │   │   ├── Card.js
│   │   │   ├── Badge.js
│   │   │   ├── Tooltip.js
│   │   │   └── index.js
│   │   │
│   │   ├── execution/
│   │   │   ├── ExecutionPanel.js
│   │   │   ├── TerminalOutput.js
│   │   │   ├── ExecutionStatus.js
│   │   │   ├── ExecutionLog.js
│   │   │   └── index.js
│   │   │
│   │   ├── session/
│   │   │   ├── SessionStatus.js
│   │   │   ├── SessionTimer.js
│   │   │   ├── AgentConnection.js
│   │   │   ├── SessionControls.js
│   │   │   └── index.js
│   │   │
│   │   └── simulation/
│   │       ├── SimulationPreview.js
│   │       ├── SimulationDiff.js
│   │       ├── SimulationWarnings.js
│   │       ├── SimulationActions.js
│   │       └── index.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSession.js
│   │   ├── useWebSocket.js
│   │   ├── useSimulation.js
│   │   ├── useExecution.js
│   │   ├── useApproval.js
│   │   ├── useAgent.js
│   │   ├── useCredentials.js
│   │   ├── useTerminal.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── websocket.js
│   │   ├── auth.js
│   │   ├── session.js
│   │   ├── command.js
│   │   └── index.js
│   │
│   ├── store/
│   │   ├── index.js
│   │   ├── authSlice.js
│   │   ├── sessionSlice.js
│   │   ├── commandSlice.js
│   │   ├── simulationSlice.js
│   │   └── executionSlice.js
│   │
│   ├── types/
│   │   ├── auth.js
│   │   ├── session.js
│   │   ├── command.js
│   │   ├── websocket.js
│   │   ├── api.js
│   │   └── index.js
│   │
│   └── utils/
│       ├── constants.js
│       ├── helpers.js
│       ├── validators.js
│       ├── formatters.js
│       ├── terminal.js
│       └── index.js
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── package.json
└── README.md
```

---

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── database.js
│   │   ├── session.js
│   │   └── websocket.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   ├── commandController.js
│   │   ├── agentController.js
│   │   └── index.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   ├── rateLimit.js
│   │   ├── errorHandler.js
│   │   ├── logger.js
│   │   ├── cors.js
│   │   └── index.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Command.js
│   │   ├── Credential.js
│   │   └── index.js
│   │
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── session.js
│   │   ├── command.js
│   │   ├── agent.js
│   │   └── health.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── sessionService.js
│   │   ├── commandService.js
│   │   ├── credentialService.js
│   │   ├── agentService.js
│   │   └── index.js
│   │
│   ├── types/
│   │   ├── auth.js
│   │   ├── session.js
│   │   ├── command.js
│   │   ├── websocket.js
│   │   ├── api.js
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── crypto.js
│   │   ├── validators.js
│   │   ├── errors.js
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   └── index.js
│   │
│   ├── websocket/
│   │   ├── index.js
│   │   ├── handlers.js
│   │   ├── channels.js
│   │   ├── broadcast.js
│   │   ├── auth.js
│   │   └── types.js
│   │
│   └── index.js
│
├── package.json
└── README.md
```

---

## Agent Structure

```
agent/
├── src/
│   ├── cli/
│   │   ├── index.js
│   │   ├── commands.js
│   │   ├── prompts.js
│   │   └── output.js
│   │
│   ├── connection/
│   │   ├── index.js
│   │   ├── handlers.js
│   │   ├── reconnect.js
│   │   └── heartbeat.js
│   │
│   ├── credentials/
│   │   ├── index.js
│   │   ├── store.js
│   │   ├── refresh.js
│   │   └── validate.js
│   │
│   ├── execution/
│   │   ├── index.js
│   │   ├── pty.js
│   │   ├── stream.js
│   │   └── lifecycle.js
│   │
│   ├── isolation/
│   │   ├── index.js
│   │   ├── capabilities.js
│   │   ├── sandbox.js
│   │   └── paths.js
│   │
│   ├── simulation/
│   │   ├── index.js
│   │   ├── parser.js
│   │   ├── predictor.js
│   │   └── validator.js
│   │
│   └── index.js
│
├── package.json
└── README.md
```

---

## Docs Structure

```
docs/
├── agent/
│   ├── README.md
│   ├── overview.md
│   ├── cli.md
│   ├── architecture.md
│   ├── execution.md
│   ├── security.md
│   └── troubleshooting.md
│
├── api/
│   ├── README.md
│   ├── overview.md
│   ├── authentication.md
│   ├── sessions.md
│   ├── commands.md
│   ├── agents.md
│   ├── errors.md
│   ├── schemas.md
│   └── endpoints.md
│
├── architecture/
│   ├── README.md
│   ├── overview.md
│   ├── components.md
│   ├── data-flow.md
│   ├── decisions.md
│   └── diagrams/
│
├── security/
│   ├── README.md
│   ├── model.md
│   ├── boundaries.md
│   ├── threats.md
│   ├── isolation.md
│   ├── credentials.md
│   └── audit.md
│
├── sessions/
│   ├── README.md
│   ├── lifecycle.md
│   ├── credentials.md
│   ├── timeout.md
│   ├── teardown.md
│   └── binding.md
│
├── setup/
│   ├── README.md
│   ├── quickstart.md
│   ├── prerequisites.md
│   ├── frontend.md
│   ├── backend.md
│   ├── agent.md
│   ├── development.md
│   ├── production.md
│   └── configuration.md
│
├── websocket/
│   ├── README.md
│   ├── overview.md
│   ├── connection.md
│   ├── channels.md
│   ├── events.md
│   ├── messages.md
│   └── flow-diagrams.md
│
└── README.md
```
