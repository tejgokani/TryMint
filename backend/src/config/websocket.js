// WebSocket-specific configuration

export const websocketConfig = {
  uiPath: process.env.TRYMINT_WS_UI_PATH || '/ws/ui',
  agentPath: process.env.TRYMINT_WS_AGENT_PATH || '/ws/agent',
  pingIntervalMs: Number(process.env.TRYMINT_WS_PING_INTERVAL_MS || 25_000),
  pingTimeoutMs: Number(process.env.TRYMINT_WS_PING_TIMEOUT_MS || 60_000)
};

