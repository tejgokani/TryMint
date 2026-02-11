// Short-lived credential generation and validation used for agents.

import { credentialStore } from '../models/index.js';
import { sessionConfig } from '../config/index.js';
import { generateToken, hashToken } from '../utils/index.js';
import { AppError } from '../utils/errors.js';

export const credentialService = {
  generate(sessionId, capabilities = []) {
    const now = new Date();
    const token = generateToken(24);
    const tokenHash = hashToken(token);
    const id = `cred-${sessionId}`;

    const cred = {
      id,
      sessionId,
      tokenHash,
      capabilities,
      createdAt: now,
      expiresAt: new Date(now.getTime() + sessionConfig.credentialTtlMs)
    };

    credentialStore.upsert(cred);

    return {
      credential: cred,
      token
    };
  },

  validate(token) {
    const tokenHash = hashToken(token);
    const cred = credentialStore.getByTokenHash(tokenHash);
    if (!cred) {
      throw new AppError('Invalid credential', 401);
    }
    if (cred.expiresAt <= new Date()) {
      throw new AppError('Credential expired', 401);
    }
    return cred;
  }
};

