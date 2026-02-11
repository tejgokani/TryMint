import { agentService } from '../services/index.js';

// REST handlers for basic agent lifecycle (connect / heartbeat / disconnect).
// These complement the WebSocket-based flow and match the README routes.

export async function connect(req, res, next) {
  try {
    const { agentId, sessionId } = req.body || {};
    const agent = agentService.register({ agentId, sessionId });
    res.status(201).json({
      success: true,
      data: {
        agentId: agent.agentId,
        sessionId: agent.sessionId
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function heartbeat(req, res, next) {
  try {
    const { agentId, status } = req.body || {};
    agentService.heartbeat(agentId, status);
    res.json({
      success: true,
      data: {
        ack: true
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function disconnect(req, res, next) {
  try {
    const { agentId } = req.body || {};
    agentService.disconnect(agentId);
    res.json({
      success: true,
      data: {
        message: 'Agent disconnected'
      }
    });
  } catch (err) {
    next(err);
  }
}

