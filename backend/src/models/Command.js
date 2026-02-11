// In-memory Command model representation

/**
 * @typedef {Object} Command
 * @property {string} id
 * @property {string} sessionId
 * @property {string} command
 * @property {string} workingDir
 * @property {'PENDING'|'SIMULATING'|'SIMULATED'|'APPROVED'|'REJECTED'|'EXECUTING'|'COMPLETED'|'FAILED'|'CANCELLED'} status
 * @property {Object|null} simulationResult
 * @property {Object|null} executionResult
 * @property {Date} createdAt
 * @property {Date|null} completedAt
 */

export class CommandStore {
  constructor() {
    /** @type {Map<string, Command>} */
    this.commands = new Map();
  }

  upsert(command) {
    this.commands.set(command.id, command);
    return command;
  }

  get(id) {
    return this.commands.get(id) || null;
  }

  listBySession(sessionId) {
    return Array.from(this.commands.values()).filter((c) => c.sessionId === sessionId);
  }
}

export const commandStore = new CommandStore();

