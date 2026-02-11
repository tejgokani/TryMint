// Short-lived credential model used for agent registration.
// For now we simply associate a generated token with a session in-memory.

/**
 * @typedef {Object} Credential
 * @property {string} id
 * @property {string} sessionId
 * @property {string} tokenHash
 * @property {string[]} capabilities
 * @property {Date} createdAt
 * @property {Date} expiresAt
 */

export class CredentialStore {
  constructor() {
    /** @type {Map<string, Credential>} */
    this.credentialsById = new Map();
    /** @type {Map<string, Credential>} */
    this.credentialsByTokenHash = new Map();
  }

  upsert(credential) {
    this.credentialsById.set(credential.id, credential);
    this.credentialsByTokenHash.set(credential.tokenHash, credential);
    return credential;
  }

  getById(id) {
    return this.credentialsById.get(id) || null;
  }

  getByTokenHash(tokenHash) {
    return this.credentialsByTokenHash.get(tokenHash) || null;
  }
}

export const credentialStore = new CredentialStore();

