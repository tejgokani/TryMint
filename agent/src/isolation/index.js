/**
 * Isolation Manager - Directory capabilities, path validation, sandbox
 */

export { resolvePath, normalize, isSubPath, followSymlinks, detectEscape } from './paths.js';
export { canAccess, extractPathsFromCommand, validateCommand, getViolations } from './capabilities.js';
export { createEnvironment, sanitizeEnv, setWorkingDir, restrictPath } from './sandbox.js';
export { initSandbox, getSandboxPath } from './sessionSandbox.js';

/**
 * Get default capabilities from env or cwd
 * TRYMINT_CAPABILITIES=path1,path2 or default to process.cwd()
 */
export function getDefaultCapabilities() {
  const env = process.env.TRYMINT_CAPABILITIES;
  if (env && typeof env === 'string') {
    return env.split(',').map((p) => p.trim()).filter(Boolean);
  }
  return [process.cwd()];
}
