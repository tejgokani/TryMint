// Command submission, simulation (mock), approval, and execution routing.
// NOTE: Backend never executes commands itself – it only coordinates with the agent.

import { commandStore } from '../models/index.js';
import { generateCommandId } from '../utils/index.js';
import { AppError, ValidationError } from '../utils/errors.js';

function basicRiskEvaluation(command, workingDir) {
  // Very lightweight, purely string-based "risk" evaluation for simulation.
  const highRiskPatterns = ['rm -rf', 'mkfs', ':(){:|:&};:', 'shutdown', 'reboot'];
  const mediumRiskPatterns = ['sudo', 'chown', 'chmod', 'apt', 'yum', 'brew'];

  const lowered = command.toLowerCase();
  const warnings = [];
  const effects = [];

  let riskLevel = 'LOW';

  if (highRiskPatterns.some((p) => lowered.includes(p))) {
    riskLevel = 'HIGH';
    warnings.push('Command appears destructive.');
  } else if (mediumRiskPatterns.some((p) => lowered.includes(p))) {
    riskLevel = 'MEDIUM';
    warnings.push('Command may require elevated privileges or modify system state.');
  }

  // Very simple effect description for UX – can be expanded later.
  if (lowered.startsWith('ls')) {
    effects.push({ type: 'READ_DIR', target: workingDir });
  } else if (lowered.startsWith('cat')) {
    effects.push({ type: 'READ_FILE', target: 'unknown' });
  }

  return {
    success: true,
    riskLevel,
    effects,
    warnings,
    canExecute: riskLevel !== 'HIGH'
  };
}

export const commandService = {
  submitForSimulation({ sessionId, command, workingDir }) {
    if (!command || !workingDir) {
      throw new ValidationError('command and workingDir are required');
    }

    const id = generateCommandId();
    const now = new Date();

    const cmd = {
      id,
      sessionId,
      command,
      workingDir,
      status: 'SIMULATING',
      simulationResult: null,
      executionResult: null,
      createdAt: now,
      completedAt: null,
      approved: false
    };

    commandStore.upsert(cmd);

    // Immediately compute a mock simulation result – in a real deployment
    // this might be delegated to the agent over WebSocket.
    const simulationResult = basicRiskEvaluation(command, workingDir);

    cmd.status = 'SIMULATED';
    cmd.simulationResult = simulationResult;
    commandStore.upsert(cmd);

    return cmd;
  },

  approveCommand(commandId) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    if (cmd.status !== 'SIMULATED') {
      throw new AppError('Command is not in a simulatable state', 400);
    }
    cmd.approved = true;
    cmd.status = 'APPROVED';
    commandStore.upsert(cmd);
    return cmd;
  },

  rejectCommand(commandId, reason = 'rejected') {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.approved = false;
    cmd.status = 'REJECTED';
    cmd.simulationResult = {
      ...(cmd.simulationResult || {}),
      success: false,
      reason
    };
    commandStore.upsert(cmd);
    return cmd;
  },

  markExecuting(commandId) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'EXECUTING';
    commandStore.upsert(cmd);
    return cmd;
  },

  completeCommand(commandId, executionResult) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'COMPLETED';
    cmd.executionResult = executionResult;
    cmd.completedAt = new Date();
    commandStore.upsert(cmd);
    return cmd;
  },

  failCommand(commandId, executionResult) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'FAILED';
    cmd.executionResult = executionResult;
    cmd.completedAt = new Date();
    commandStore.upsert(cmd);
    return cmd;
  },

  cancelCommand(commandId) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'CANCELLED';
    cmd.completedAt = new Date();
    commandStore.upsert(cmd);
    return cmd;
  },

  getHistory(sessionId, { limit = 50, offset = 0 } = {}) {
    const all = commandStore.listBySession(sessionId);
    const total = all.length;
    const slice = all
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(offset, offset + limit);
    return { commands: slice, total };
  }
};

