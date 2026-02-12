// Command submission, simulation, approval, and execution routing.
// NOTE: Backend never executes commands itself – it only coordinates with the agent.
// Risk evaluation uses riskEngine (real analysis, no mocks).

import { commandStore } from '../models/index.js';
import { generateCommandId } from '../utils/index.js';
import { AppError, ValidationError } from '../utils/errors.js';
import { evaluate } from '../riskEngine/index.js';

export const commandService = {
  async submitForSimulation({ sessionId, command, workingDir }) {
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
      executionSteps: [{ phase: 'SUBMITTED', timestamp: now.getTime(), status: 'pending' }],
      createdAt: now,
      completedAt: null,
      approved: false
    };

    commandStore.upsert(cmd);

    const evaluation = await evaluate(command, workingDir);

    const simulationResult = {
      success: evaluation.success,
      riskLevel: evaluation.riskLevel,
      finalScore: evaluation.finalScore,
      destructiveness: evaluation.destructiveness,
      privilege: evaluation.privilege,
      dependencyRisk: evaluation.dependencyRisk,
      networkRisk: evaluation.networkRisk,
      behavioralRisk: evaluation.behavioralRisk,
      triggers: evaluation.triggers,
      analysisSteps: evaluation.analysisSteps,
      effects: evaluation.effects || [],
      warnings: evaluation.warnings || [],
      canExecute: evaluation.canExecute,
    };

    cmd.status = 'SIMULATED';
    cmd.simulationResult = simulationResult;
    cmd.executionSteps.push({ phase: 'SIMULATED', timestamp: Date.now(), status: 'complete', riskLevel: simulationResult.riskLevel });
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
    cmd.executionSteps.push({ phase: 'APPROVED', timestamp: Date.now(), status: 'complete' });
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
    cmd.executionSteps.push({ phase: 'EXECUTING', timestamp: Date.now(), status: 'started' });
    commandStore.upsert(cmd);
    return cmd;
  },

  completeCommand(commandId, executionResult) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'COMPLETED';
    const completedAt = new Date();
    const steps = [...(cmd.executionSteps || []), {
      phase: 'COMPLETED',
      timestamp: completedAt.getTime(),
      status: 'complete',
      exitCode: executionResult?.exitCode,
      duration: executionResult?.duration,
    }];
    cmd.executionResult = { ...executionResult, executionSteps: steps };
    cmd.executionSteps = steps;
    cmd.completedAt = completedAt;
    commandStore.upsert(cmd);
    return cmd;
  },

  failCommand(commandId, executionResult) {
    const cmd = commandStore.get(commandId);
    if (!cmd) {
      throw new AppError('Command not found', 404);
    }
    cmd.status = 'FAILED';
    const failedAt = new Date();
    const steps = [...(cmd.executionSteps || []), {
      phase: 'FAILED',
      timestamp: failedAt.getTime(),
      status: 'failed',
      exitCode: executionResult?.exitCode,
      duration: executionResult?.duration,
    }];
    cmd.executionResult = { ...executionResult, executionSteps: steps };
    cmd.executionSteps = steps;
    cmd.completedAt = failedAt;
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

