# Architecture Documentation

> System architecture and design documentation

## Purpose

Documents the overall system architecture, component interactions, design decisions, and technical rationale.

## File Map

| File | Purpose |
|------|---------|
| `overview.md` | High-level architecture overview |
| `components.md` | Component descriptions |
| `data-flow.md` | Data flow diagrams |
| `decisions.md` | Architecture decision records |
| `diagrams/` | Architecture diagrams |

## Overview (overview.md)

Contents:
- System context diagram
- High-level component diagram
- Technology stack
- Deployment architecture
- Key design principles

## Components (components.md)

Contents:
- Frontend component breakdown
- Backend component breakdown
- Agent component breakdown
- Component responsibilities
- Component interfaces

## Data Flow (data-flow.md)

Contents:
- Command submission flow
- Simulation flow
- Approval flow
- Execution flow
- Authentication flow
- Session lifecycle flow

## Decisions (decisions.md)

Architecture Decision Records (ADRs):
- ADR-001: WebSocket vs HTTP polling
- ADR-002: node-pty for terminal emulation
- ADR-003: Short-lived credentials design
- ADR-004: Capability-based isolation
- ADR-005: Simulation-first approach

## Diagrams

```
diagrams/
├── context.png         # System context
├── components.png      # Component diagram
├── sequence/           # Sequence diagrams
│   ├── auth-flow.png
│   ├── command-flow.png
│   └── session-flow.png
└── deployment.png      # Deployment diagram
```
