// Simple in-memory User model placeholder.
// Real user data will typically be sourced from Google OAuth profile.

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string|null} picture
 * @property {Date} createdAt
 * @property {Date} lastLogin
 */

export class UserStore {
  constructor() {
    /** @type {Map<string, User>} */
    this.users = new Map();
  }

  upsert(user) {
    this.users.set(user.id, user);
    return user;
  }

  get(id) {
    return this.users.get(id) || null;
  }
}

export const userStore = new UserStore();

