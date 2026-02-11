// Broadcasting utilities for server → client/agent events.

import { randomUUID } from 'crypto';
import { getUiConnections, getAgentConnection } from './channels.js';

function buildMessage(type, payload) {
  return JSON.stringify({
    type,
    payload,
    timestamp: Date.now(),
    id: `msg-${randomUUID()}`
  });
}

export const broadcaster = {
  toSession(sessionId, type, payload) {
    const set = getUiConnections(sessionId);
    if (!set || set.size === 0) return;
    const msg = buildMessage(type, payload);
    set.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(msg);
      }
    });
  },

  toAgent(sessionId, type, payload) {
    const ws = getAgentConnection(sessionId);
    if (!ws || ws.readyState !== ws.OPEN) return;
    ws.send(buildMessage(type, payload));
  }
};

