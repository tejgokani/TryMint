// Channel and connection management for WebSocket server.

const uiConnectionsBySession = new Map(); // sessionId -> Set<ws>
const agentConnectionBySession = new Map(); // sessionId -> ws

export function addUiConnection(sessionId, ws) {
  if (!uiConnectionsBySession.has(sessionId)) {
    uiConnectionsBySession.set(sessionId, new Set());
  }
  uiConnectionsBySession.get(sessionId).add(ws);
}

export function removeUiConnection(sessionId, ws) {
  const set = uiConnectionsBySession.get(sessionId);
  if (!set) return;
  set.delete(ws);
  if (set.size === 0) {
    uiConnectionsBySession.delete(sessionId);
  }
}

export function getUiConnections(sessionId) {
  return uiConnectionsBySession.get(sessionId) || new Set();
}

export function setAgentConnection(sessionId, ws) {
  agentConnectionBySession.set(sessionId, ws);
}

export function clearAgentConnection(sessionId) {
  agentConnectionBySession.delete(sessionId);
}

export function getAgentConnection(sessionId) {
  return agentConnectionBySession.get(sessionId) || null;
}

//channels updated
