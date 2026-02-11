// Unified WebSocket message handlers.

import { commandService } from '../services/index.js';

export function handleClientMessage({ raw, ws, sessionId, broadcaster }) {
  let msg;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return;
  }

  const { type, payload } = msg;

  switch (type) {
    case 'command:submit': {
      const cmd = commandService.submitForSimulation({
        sessionId,
        command: payload.command,
        workingDir: payload.workingDir
      });
      broadcaster.toSession(sessionId, 'simulation:result', {
        commandId: cmd.id,
        ...cmd.simulationResult
      });
      break;
    }
    case 'command:approve': {
      const cmd = commandService.approveCommand(payload.commandId);
      broadcaster.toAgent(sessionId, 'agent:execute', {
        commandId: cmd.id,
        command: cmd.command,
        workingDir: cmd.workingDir
      });
      broadcaster.toSession(sessionId, 'execution:started', {
        commandId: cmd.id,
        command: cmd.command
      });
      break;
    }
    case 'command:reject': {
      const cmd = commandService.rejectCommand(payload.commandId, payload.reason);
      broadcaster.toSession(sessionId, 'simulation:failed', {
        commandId: cmd.id,
        error: payload.reason || 'user_rejected',
        violations: []
      });
      break;
    }
    case 'execution:cancel': {
      const cmd = commandService.cancelCommand(payload.commandId);
      broadcaster.toAgent(sessionId, 'execution:cancel', {
        commandId: cmd.id
      });
      break;
    }
    default:
      break;
  }
}

export function handleAgentMessage({ raw, ws, sessionId, broadcaster }) {
  let msg;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return;
  }

  const { type, payload } = msg;

  switch (type) {
    case 'simulation:result': {
      broadcaster.toSession(sessionId, 'simulation:result', payload);
      break;
    }
    case 'execution:output': {
      broadcaster.toSession(sessionId, 'execution:output', payload);
      break;
    }
    case 'execution:complete': {
      if (typeof payload.exitCode === 'number') {
        const result = {
          exitCode: payload.exitCode,
          duration: payload.duration
        };
        if (payload.exitCode === 0) {
          commandService.completeCommand(payload.commandId, result);
        } else {
          commandService.failCommand(payload.commandId, result);
        }
      }
      broadcaster.toSession(sessionId, 'execution:complete', payload);
      break;
    }
    case 'agent:heartbeat': {
      broadcaster.toSession(sessionId, 'agent:heartbeat', payload);
      break;
    }
    default:
      break;
  }
}

