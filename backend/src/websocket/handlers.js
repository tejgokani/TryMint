// Unified WebSocket message handlers.

import { commandService } from '../services/index.js';
import { analyzePostmortem, formatTerminalReport } from '../services/postmortemService.js';
import { getAgentConnection } from './channels.js';

export async function handleClientMessage({ raw, ws, sessionId, broadcaster }) {
  let msg;
  try {
    msg = JSON.parse(raw.toString());
  } catch {
    return;
  }

  const { type, payload } = msg;

  switch (type) {
    case 'command:submit': {
      const cmd = await commandService.submitForSimulation({
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
    case 'filesystem:list': {
      broadcaster.toAgent(sessionId, 'filesystem:list', payload);
      break;
    }
    case 'filesystem:read': {
      broadcaster.toAgent(sessionId, 'filesystem:read', payload);
      break;
    }
    case 'postmortem:start': {
      if (!getAgentConnection(sessionId)) {
        broadcaster.toSession(sessionId, 'postmortem:error', {
          error: 'Agent not connected. Run trymint connect in your project directory.'
        });
      } else {
        broadcaster.toAgent(sessionId, 'agent:postmortem:request', payload);
      }
      break;
    }
    default:
      break;
  }
}

async function handlePostmortemData(sessionId, payload, broadcaster) {
  try {
    const { packageJson, files = {}, packagePath = '/', error } = payload;
    if (error) {
      broadcaster.toSession(sessionId, 'postmortem:error', { error });
      return;
    }
    if (!packageJson) {
      broadcaster.toSession(sessionId, 'postmortem:error', { error: 'No package.json data received' });
      return;
    }
    const report = await analyzePostmortem({ packageJson, files, packagePath, deepScan: true });
    const terminalReport = formatTerminalReport(report);
    broadcaster.toSession(sessionId, 'postmortem:complete', { report, terminalReport });
  } catch (err) {
    broadcaster.toSession(sessionId, 'postmortem:error', { error: err.message || 'Postmortem analysis failed' });
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
    case 'agent:ready': {
      broadcaster.toSession(sessionId, 'agent:ready', payload);
      break;
    }
    case 'filesystem:list:result': {
      broadcaster.toSession(sessionId, 'filesystem:list:result', payload);
      break;
    }
    case 'filesystem:content': {
      broadcaster.toSession(sessionId, 'filesystem:content', payload);
      break;
    }
    case 'agent:postmortem:data': {
      handlePostmortemData(sessionId, payload, broadcaster).catch(() => {});
      break;
    }
    default:
      break;
  }
}

