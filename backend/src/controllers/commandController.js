import { commandService } from '../services/index.js';

// REST handlers for simulation and execution lifecycle.

export async function simulate(req, res, next) {
  try {
    const { command, workingDir } = req.body || {};
    const { sessionId } = req.query;

    const cmd = await commandService.submitForSimulation({
      sessionId,
      command,
      workingDir
    });

    res.status(201).json({
      success: true,
      data: {
        commandId: cmd.id,
        status: cmd.status,
        simulation: cmd.simulationResult
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function execute(req, res, next) {
  try {
    const { commandId } = req.body || {};

    const cmd = commandService.markExecuting(commandId);

    // NOTE: Actual forwarding to agent is handled by WebSocket layer,
    // which will listen for this transition and push an event to the
    // connected agent channel.

    res.json({
      success: true,
      data: {
        commandId: cmd.id,
        status: cmd.status
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getHistory(req, res, next) {
  try {
    const { sessionId, limit, offset } = req.query;
    const history = commandService.getHistory(sessionId, {
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined
    });
    res.json({
      success: true,
      data: history
    });
  } catch (err) {
    next(err);
  }
}

export async function cancel(req, res, next) {
  try {
    const { id } = req.params;
    commandService.cancelCommand(id);
    res.json({
      success: true,
      data: {
        message: 'Command cancelled'
      }
    });
  } catch (err) {
    next(err);
  }
}

