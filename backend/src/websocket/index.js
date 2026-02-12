// WebSocket server setup for UI and Agent channels.
// Keeps routing logic separate from REST controllers.

import { WebSocketServer } from 'ws';
import { websocketConfig } from '../config/index.js';
import { sessionService } from '../services/index.js';
import { logger } from '../utils/logger.js';
import { addUiConnection, removeUiConnection, setAgentConnection, clearAgentConnection, getAgentConnection } from './channels.js';
import { broadcaster } from './broadcast.js';
import { handleClientMessage, handleAgentMessage } from './handlers.js';

export function createWebSocketServers(httpServer) {
  const uiWss = new WebSocketServer({ noServer: true });
  const agentWss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const { url } = request;
    if (url.startsWith(websocketConfig.uiPath)) {
      uiWss.handleUpgrade(request, socket, head, (ws) => {
        uiWss.emit('connection', ws, request);
      });
    } else if (url.startsWith(websocketConfig.agentPath)) {
      agentWss.handleUpgrade(request, socket, head, (ws) => {
        agentWss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  uiWss.on('connection', (ws, request) => {
    // UI connects with ?sessionId=&sessionSecret=
    const url = new URL(request.url, 'http://localhost');
    const sessionId = url.searchParams.get('sessionId');
    const sessionSecret = url.searchParams.get('sessionSecret');

    try {
      const session = sessionService.validateSessionSecret(sessionId, sessionSecret);
      addUiConnection(session.id, ws);

      const agentWs = getAgentConnection(session.id);
      const agentConnected = agentWs && agentWs.readyState === 1; // 1 = OPEN

      ws.send(
        JSON.stringify({
          type: 'session:connected',
          payload: {
            sessionId: session.id,
            expiresAt: session.expiresAt.getTime(),
            agentConnected
          },
          timestamp: Date.now()
        })
      );

      ws.on('message', async (data) => {
        await handleClientMessage({
          raw: data,
          ws,
          sessionId: session.id,
          broadcaster
        });
      });

      ws.on('close', () => {
        removeUiConnection(session.id, ws);
      });
    } catch (err) {
      logger.warn('ui_ws_auth_failed', { error: err.message });
      ws.close(4401, 'Unauthorized');
    }
  });

  agentWss.on('connection', (ws, request) => {
    // Agent connects with ?sessionId=&sessionSecret=
    const url = new URL(request.url, 'http://localhost');
    const sessionId = url.searchParams.get('sessionId');
    const sessionSecret = url.searchParams.get('sessionSecret');

    try {
      const session = sessionService.validateSessionSecret(sessionId, sessionSecret);
      sessionService.bindAgent(session.id);
      setAgentConnection(session.id, ws);

      broadcaster.toSession(session.id, 'agent:connected', {
        agentId: 'agent-bound-to-session',
        capabilities: [],
        version: '1.0.0'
      });

      ws.on('message', (data) => {
        handleAgentMessage({
          raw: data,
          ws,
          sessionId: session.id,
          broadcaster
        });
      });

      ws.on('close', () => {
        sessionService.unbindAgent(session.id);
        clearAgentConnection(session.id);
        broadcaster.toSession(session.id, 'agent:disconnected', {
          agentId: 'agent-bound-to-session',
          reason: 'ws_close'
        });
      });
    } catch (err) {
      logger.warn('agent_ws_auth_failed', { error: err.message });
      ws.close(4401, 'Unauthorized');
    }
  });

  // Periodic ping/heartbeat
  setInterval(() => {
    uiWss.clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
    agentWss.clients.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    });
  }, websocketConfig.pingIntervalMs);
}

