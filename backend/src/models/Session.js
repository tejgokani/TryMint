// In-memory Session model representation (no real DB yet)

import { SESSION_STATUS, sessionConfig } from '../config/index.js';

/**
 * @typedef {Object} Session
 * @property {string} id
 * @property {string} sessionSecretHash
 * @property {string} userId
 * @property {string|null} licenseId
 * @property {Date} expiresAt
 * @property {boolean} agentConnected
 * @property {'ACTIVE'|'EXPIRED'|'TERMINATED'} status
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export class SessionStore {
  constructor() {
    /** @type {Map<string, Session>} */
    this.sessions = new Map();
  }

  upsert(session) {
    this.sessions.set(session.id, session);
    return session;
  }

  get(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  delete(sessionId) {
    this.sessions.delete(sessionId);
  }

  listByUser(userId) {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  }

  /**
   * Mark expired sessions based on current time.
   */
  expireSessions(now = new Date()) {
    for (const session of this.sessions.values()) {
      if (session.status === SESSION_STATUS.ACTIVE && session.expiresAt <= now) {
        session.status = SESSION_STATUS.EXPIRED;
        session.agentConnected = false;
        session.updatedAt = now;
      }
    }
  }

  /**
   * Hard cleanup for terminated/expired sessions past TTL.
   */
  purgeOld(now = new Date()) {
    for (const [id, session] of this.sessions.entries()) {
      if (
        (session.status === SESSION_STATUS.EXPIRED ||
          session.status === SESSION_STATUS.TERMINATED) &&
        now.getTime() - session.expiresAt.getTime() > sessionConfig.sessionTtlMs
      ) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionStore = new SessionStore();

