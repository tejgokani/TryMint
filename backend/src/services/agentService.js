// Agent communication and status management (REST + WebSocket).

import { AppError } from '../utils/errors.js';

const agents = new Map(); // agentId -> { sessionId, status, lastHeartbeat }

export const agentService = {
  register({ agentId, sessionId }) {
    if (!agentId || !sessionId) {
      throw new AppError('agentId and sessionId are required', 400);
    }
    agents.set(agentId, {
      agentId,
      sessionId,
      status: 'online',
      lastHeartbeat: new Date()
    });
    return agents.get(agentId);
  },

  heartbeat(agentId, status = 'online') {
    const info = agents.get(agentId);
    if (!info) {
      throw new AppError('Agent not found', 404);
    }
    info.status = status;
    info.lastHeartbeat = new Date();
    return info;
  },

  disconnect(agentId) {
    const info = agents.get(agentId);
    if (!info) {
      return null;
    }
    agents.delete(agentId);
    return info;
  }
};

