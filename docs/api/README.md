# API Reference Documentation

> REST API endpoint documentation

## Purpose

Complete reference for all REST API endpoints including request/response schemas, authentication requirements, and error codes.

## File Map

| File | Purpose |
|------|---------|
| `overview.md` | API overview and conventions |
| `authentication.md` | Auth endpoints |
| `sessions.md` | Session endpoints |
| `commands.md` | Command endpoints |
| `agents.md` | Agent endpoints |
| `errors.md` | Error codes and responses |
| `schemas.md` | Request/response schemas |

## Overview (overview.md)

Contents:
- Base URL configuration
- Authentication methods
- Request format
- Response format
- Versioning
- Rate limiting

## Authentication (authentication.md)

Endpoints:
- `POST /auth/google` - Initiate OAuth
- `GET /auth/callback` - OAuth callback
- `POST /auth/logout` - Logout
- `GET /auth/me` - Current user

## Sessions (sessions.md)

Endpoints:
- `POST /session` - Create session
- `GET /session` - Get session status
- `POST /session/refresh` - Refresh credentials
- `DELETE /session` - Terminate session

## Commands (commands.md)

Endpoints:
- `POST /command/simulate` - Simulate command
- `POST /command/execute` - Execute command
- `GET /command/history` - Get history
- `DELETE /command/:id` - Cancel command

## Agents (agents.md)

Endpoints:
- `POST /agent/connect` - Connect agent
- `POST /agent/heartbeat` - Heartbeat
- `POST /agent/disconnect` - Disconnect agent

## Errors (errors.md)

Error codes and their meanings:
- `AUTH_*` - Authentication errors
- `SESSION_*` - Session errors
- `COMMAND_*` - Command errors
- `AGENT_*` - Agent errors
- `VALIDATION_*` - Validation errors

## Schemas (schemas.md)

Request/response JSON schemas for all endpoints.
