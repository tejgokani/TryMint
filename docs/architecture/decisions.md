# Architecture Decision Records

> Key Architecture Decisions

---

## 📋 Overview

This document records significant architecture decisions made during TRYMINT development.

---

## ADR-001: Simulation-First Execution Model

### Status
Accepted

### Context
Users need to execute commands on their local machines through a web interface. Direct execution poses security risks.

### Decision
All commands must be simulated before execution. Simulation results are presented to the user, who must explicitly approve before actual execution.

### Consequences
- **Positive**: Users can preview command effects before execution
- **Positive**: Reduces accidental destructive operations
- **Negative**: Adds latency to execution flow
- **Negative**: Simulation may not capture all side effects

---

## ADR-002: Short-Lived Session Credentials

### Status
Accepted

### Context
Long-lived credentials increase attack surface if compromised.

### Decision
Session credentials expire after a configured TTL (default: 1 hour). Credentials can be refreshed if the user maintains an active session.

### Consequences
- **Positive**: Limited exposure window for compromised credentials
- **Positive**: Automatic cleanup of stale sessions
- **Negative**: Users must re-authenticate after expiry
- **Negative**: Requires credential refresh mechanism

---

## ADR-003: WebSocket for Real-Time Communication

### Status
Accepted

### Context
PTY output streaming requires low-latency bidirectional communication.

### Decision
Use WebSocket for all real-time communication between frontend, backend, and agent.

### Consequences
- **Positive**: Low latency for streaming output
- **Positive**: Bidirectional communication
- **Negative**: Stateful connections require careful management
- **Negative**: Reconnection logic required

---

## ADR-004: Capability-Based Directory Isolation

### Status
Accepted

### Context
Agents need filesystem access but should be restricted to specific directories.

### Decision
Implement capability-based access control. Agents are configured with explicit directory capabilities. All path operations are validated against capabilities.

### Consequences
- **Positive**: Clear security boundaries
- **Positive**: User controls access scope
- **Negative**: Requires path validation on every operation
- **Negative**: Symlinks require special handling

---

## ADR-005: Mandatory Logout Teardown

### Status
Accepted

### Context
Logout should completely clear all session state to prevent credential reuse.

### Decision
Logout triggers mandatory teardown: agent disconnects, credentials are cleared, sessions are revoked, local storage is cleared.

### Consequences
- **Positive**: Clean security boundary on logout
- **Positive**: No residual credentials
- **Negative**: Cannot preserve any session state
- **Negative**: Requires coordination across components

---

## ADR-006: node-pty for PTY Execution

### Status
Accepted

### Context
Agent needs to execute commands with full PTY support for interactive programs.

### Decision
Use node-pty library for PTY-based command execution in the agent.

### Consequences
- **Positive**: Full PTY support (colors, control sequences)
- **Positive**: Interactive command support
- **Negative**: Platform-specific native dependencies
- **Negative**: Requires compilation on install

---

## ADR-007: Google OAuth for Authentication

### Status
Accepted

### Context
Need secure authentication without building custom identity system.

### Decision
Use Google OAuth for user authentication. Backend validates Google tokens and issues session credentials.

### Consequences
- **Positive**: Secure, well-tested authentication
- **Positive**: No password management
- **Negative**: Requires Google account
- **Negative**: Dependency on external service

---

## ADR-008: Monorepo Structure

### Status
Accepted

### Context
Project consists of multiple packages (frontend, backend, agent) with shared types and tooling.

### Decision
Use pnpm workspaces for monorepo management. All packages live in single repository.

### Consequences
- **Positive**: Shared dependencies and tooling
- **Positive**: Atomic commits across packages
- **Positive**: Simplified development workflow
- **Negative**: Larger repository size
- **Negative**: Build complexity

---

## 🔗 Related Documents

- [Architecture Overview](overview.md)
- [Security Model](../security/model.md)
