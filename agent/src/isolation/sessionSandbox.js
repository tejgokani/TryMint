/**
 * Session Sandbox - Dedicated directory for each session where npm packages are installed
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

const SANDBOX_PREFIX = 'trymint-sandbox-';

/**
 * Create or get a sandbox directory for the session
 * @param {string} sessionId - Session ID
 * @returns {string} Absolute path to sandbox directory
 */
export function getSandboxPath(sessionId) {
  const safeId = (sessionId || 'default').replace(/[^a-zA-Z0-9-_]/g, '_');
  const home = os.homedir() || process.env.HOME || process.cwd();
  const dir = path.join(home, SANDBOX_PREFIX + safeId);
  return path.resolve(dir);
}

/**
 * Initialize sandbox directory: create if needed, add package.json
 * @param {string} sessionId - Session ID
 * @returns {string} Absolute path to sandbox directory
 */
export function initSandbox(sessionId) {
  const sandboxPath = getSandboxPath(sessionId);

  if (!fs.existsSync(sandboxPath)) {
    fs.mkdirSync(sandboxPath, { recursive: true });

    const packageJson = {
      name: 'trymint-sandbox',
      version: '1.0.0',
      description: 'TRYMINT evaluation sandbox',
      private: true,
    };
    fs.writeFileSync(
      path.join(sandboxPath, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf8'
    );
  }

  return sandboxPath;
}
