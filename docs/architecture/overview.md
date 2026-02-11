# Architecture Overview

> TRYMINT System Architecture

---

## 📋 Introduction

TRYMINT is a secure simulation-first command execution platform. This document provides a high-level overview of the system architecture, component interactions, and design principles.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                 USER LAYER                                    │
│                                                                               │
│   ┌─────────────────────┐                        ┌─────────────────────┐     │
│   │      Browser        │                        │    Local Machine    │     │
│   │   (Frontend App)    │                        │      (Agent)        │     │
│   └──────────┬──────────┘                        └──────────┬──────────┘     │
│              │                                              │                │
└──────────────┼──────────────────────────────────────────────┼────────────────┘
               │ HTTPS/WSS                                    │ WSS
               │                                              │
┌──────────────┼──────────────────────────────────────────────┼────────────────┐
│              ▼                                              ▼                │
│   ┌──────────────────────────────────────────────────────────────────┐       │
│   │                         BACKEND SERVER                           │       │
│   │                                                                  │       │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │       │
│   │  │   Auth     │  │  Session   │  │  WebSocket │  │  Command   │ │       │
│   │  │  Service   │  │  Manager   │  │  Gateway   │  │  Router    │ │       │
│   │  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │       │
│   │                                                                  │       │
│   └──────────────────────────────────────────────────────────────────┘       │
│                              SERVICE LAYER                                    │
└──────────────────────────────────────────────────────────────────────────────┘
               │
               │ OAuth
               ▼
┌──────────────────────────┐
│    Google OAuth Server   │
└──────────────────────────┘
```

---

## 🧩 Components

### Frontend
- **Technology**: React/Next.js
- **Purpose**: User interface for authentication, command submission, simulation review, and approval
- **Location**: `frontend/`

### Backend
- **Technology**: Node.js/Express
- **Purpose**: API server, WebSocket gateway, session management, authentication
- **Location**: `backend/`

### Agent
- **Technology**: Node.js/node-pty
- **Purpose**: Local command execution, simulation, PTY streaming, directory isolation
- **Location**: `agent/`

---

## 🔄 Data Flow

### Authentication Flow

```
User → Frontend → Backend → Google OAuth
                    ↓
                 Session Created
                    ↓
                 Token Returned
                    ↓
        Frontend ← Backend
```

### Command Execution Flow

```
User → Frontend → Backend → Agent
           ↓          ↓         ↓
        Display    Route    Simulate
           ↓          ↓         ↓
        Review  ← Result ← Simulation
           ↓
        Approve
           ↓
        Frontend → Backend → Agent
                              ↓
                           Execute
                              ↓
        Display  ← Stream ← PTY Output
```

---

## 🔑 Design Principles

### 1. Simulation First
Every command is simulated before execution. Users must explicitly approve execution after reviewing simulation results.

### 2. Short-Lived Sessions
Sessions have limited lifetime. Credentials expire automatically, reducing attack window.

### 3. Capability-Based Isolation
Agents operate within explicit directory capabilities. Access outside defined boundaries is blocked.

### 4. Mandatory Teardown
Logout triggers complete session cleanup. All credentials, connections, and state are cleared.

### 5. Defense in Depth
Multiple security layers protect against various attack vectors.

---

## 📦 Package Dependencies

### Frontend Dependencies (Conceptual)
- React/Next.js framework
- WebSocket client
- State management
- UI component library

### Backend Dependencies (Conceptual)
- Express framework
- WebSocket server
- OAuth library
- JWT library

### Agent Dependencies (Conceptual)
- node-pty for PTY
- WebSocket client
- Credential storage
- CLI framework

---

## 🔗 Related Documents

- [Component Details](components.md)
- [Data Flow Diagrams](data-flow.md)
- [Architecture Decisions](decisions.md)
- [Security Model](../security/model.md)
