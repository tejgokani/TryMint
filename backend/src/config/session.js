// Session and credential configuration

export const SESSION_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED'
};

export const sessionConfig = {
  // Default maximum session duration (ms)
  sessionTtlMs: Number(process.env.TRYMINT_SESSION_TTL_MS || 2 * 60 * 60 * 1000),
  // Credential / session_secret TTL (ms)
  credentialTtlMs: Number(process.env.TRYMINT_CREDENTIAL_TTL_MS || 15 * 60 * 1000),
  // Last N ms during which refresh is allowed
  refreshWindowMs: Number(process.env.TRYMINT_REFRESH_WINDOW_MS || 5 * 60 * 1000),
  maxSessionsPerUser: Number(process.env.TRYMINT_MAX_SESSIONS_PER_USER || 5),
  cleanupIntervalMs: Number(process.env.TRYMINT_SESSION_CLEANUP_INTERVAL_MS || 60 * 1000)
};

