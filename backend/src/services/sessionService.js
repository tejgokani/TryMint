// Session lifecycle management using in-memory store.
// Responsible for creating, fetching, refreshing, terminating sessions
// and enforcing single-agent-per-session + TTL rules.

import { SESSION_STATUS, sessionConfig } from '../config/index.js';
import { sessionStore } from '../models/index.js';
import { generateSessionId, generateToken, hashToken, compareHash } from '../utils/index.js';
import {
  AppError,
  SessionExpiredError,
  ValidationError,
  AuthorizationError
} from '../utils/errors.js';

function computeExpiry(customTtlMs) {
  const ttl = customTtlMs && Number.isFinite(customTtlMs) ? customTtlMs : sessionConfig.sessionTtlMs;
  return new Date(Date.now() + ttl);
}

function assertSessionActive(session) {
  if (!session) {
    throw new AppError('Session not found', 404);
  }
  if (session.status === SESSION_STATUS.TERMINATED) {
    throw new AuthorizationError('Session terminated');
  }
  if (session.expiresAt <= new Date() || session.status === SESSION_STATUS.EXPIRED) {
    session.status = SESSION_STATUS.EXPIRED;
    throw new SessionExpiredError();
  }
}

export const sessionService = {
  /**
   * Create a new session for a user and license.
   * Returns session plus a plaintext sessionSecret (never stored).
   */
  createSession({ userId, licenseId = null, ttlMs }) {
    if (!userId) {
      throw new ValidationError('userId is required');
    }

    const existing = sessionStore.listByUser(userId).filter(
      (s) => s.status === SESSION_STATUS.ACTIVE
    );
    if (existing.length >= sessionConfig.maxSessionsPerUser) {
      throw new AppError('Maximum active sessions reached', 429);
    }

    const id = generateSessionId();
    const sessionSecret = generateToken(32);
    const now = new Date();
    const expiresAt = computeExpiry(ttlMs);

    const session = {
      id,
      sessionSecretHash: hashToken(sessionSecret),
      userId,
      licenseId,
      expiresAt,
      agentConnected: false,
      status: SESSION_STATUS.ACTIVE,
      createdAt: now,
      updatedAt: now
    };

    sessionStore.upsert(session);

    return {
      session,
      sessionSecret
    };
  },

  getSession(sessionId) {
    const session = sessionStore.get(sessionId);
    if (!session) {
      throw new AppError('Session not found', 404);
    }
    sessionStore.expireSessions(new Date());
    return session;
  },

  /**
   * Validate session + secret pair (used for WebSocket auth & agents).
   */
  validateSessionSecret(sessionId, sessionSecret) {
    const session = sessionStore.get(sessionId);
    assertSessionActive(session);
    if (!session.sessionSecretHash || !compareHash(sessionSecret, session.sessionSecretHash)) {
      throw new AuthorizationError('Invalid session secret');
    }
    return session;
  },

  /**
   * Rotate the session_secret while keeping the same session id.
   * Useful for credential refresh.
   */
  refreshSessionSecret(sessionId) {
    const session = sessionStore.get(sessionId);
    assertSessionActive(session);

    const now = new Date();
    // Allow refresh anytime for active sessions (removed restrictive refresh window)
    const newSecret = generateToken(32);
    session.sessionSecretHash = hashToken(newSecret);
    session.expiresAt = computeExpiry(); // extend TTL
    session.updatedAt = now;

    sessionStore.upsert(session);

    return {
      session,
      sessionSecret: newSecret
    };
  },

  /**
   * Mark session as terminated and invalidate session_secret.
   */
  terminateSession(sessionId) {
    const session = sessionStore.get(sessionId);
    if (!session) {
      return null;
    }
    session.status = SESSION_STATUS.TERMINATED;
    session.sessionSecretHash = null;
    session.agentConnected = false;
    session.updatedAt = new Date();
    sessionStore.upsert(session);
    return session;
  },

  /**
   * Bind an agent to a session. Enforces single-agent-per-session.
   */
  bindAgent(sessionId) {
    const session = sessionStore.get(sessionId);
    assertSessionActive(session);
    if (session.agentConnected) {
      throw new AppError('Agent already connected for this session', 409);
    }
    session.agentConnected = true;
    session.updatedAt = new Date();
    sessionStore.upsert(session);
    return session;
  },

  /**
   * Mark that agent is disconnected from the session.
   */
  unbindAgent(sessionId) {
    const session = sessionStore.get(sessionId);
    if (!session) return null;
    session.agentConnected = false;
    session.updatedAt = new Date();
    sessionStore.upsert(session);
    return session;
  },

  /**
   * Background cleanup: expire and purge old sessions.
   */
  runCleanup() {
    const now = new Date();
    sessionStore.expireSessions(now);
    sessionStore.purgeOld(now);
  }
};

