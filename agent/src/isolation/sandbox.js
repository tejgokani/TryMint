/**
 * Sandbox Environment - Safe environment for command execution
 */

import { resolvePath } from './paths.js';
import { canAccess } from './capabilities.js';

const DANGEROUS_ENV_VARS = [
  'LD_PRELOAD',
  'LD_LIBRARY_PATH',
  'DYLD_INSERT_LIBRARIES',
  'PYTHONPATH',
  'NODE_OPTIONS',
  'RUBYOPT',
  'PERL5OPT',
];

/**
 * Create a safe environment for execution
 * @param {string[]} capabilities - Allowed directory paths
 * @param {string} workingDir - Working directory
 * @returns {object} Safe env and cwd
 */
export function createEnvironment(capabilities = [], workingDir = process.cwd()) {
  const env = sanitizeEnv(process.env);
  const cwd = setWorkingDir(workingDir, capabilities);

  return { env, cwd };
}

/**
 * Remove dangerous environment variables
 */
export function sanitizeEnv(env = {}) {
  const safe = { ...env };
  for (const key of DANGEROUS_ENV_VARS) {
    delete safe[key];
  }
  return safe;
}

/**
 * Set working directory - must be within capabilities
 * @returns {string} Safe cwd or process.cwd() if violation
 */
export function setWorkingDir(path, capabilities = []) {
  if (!Array.isArray(capabilities) || capabilities.length === 0) return resolvePath(path, process.cwd());
  if (capabilities.includes('*')) return resolvePath(path, process.cwd());

  const resolved = resolvePath(path, process.cwd());
  const allowed = canAccess(path, capabilities, process.cwd());

  return allowed ? resolved : process.cwd();
}

/**
 * Restrict PATH to only include safe directories (optional)
 * For now returns unchanged - can be extended to filter PATH
 */
export function restrictPath(env, capabilities = []) {
  return env;
}
