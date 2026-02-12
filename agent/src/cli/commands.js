/**
 * CLI Command Implementations
 */

import path from 'path';
import chalk from 'chalk';
import { promptForCredentials } from './prompts.js';
import { ConnectionManager } from '../connection/index.js';
import { CredentialManager } from '../credentials/index.js';
import { formatOutput } from './output.js';
import { registerHandlers } from '../handlers/index.js';
import { initSandbox } from '../isolation/index.js';

let connectionManager = null;

// For Step 1, we'll use stubs that don't actually connect
// Full implementation will be in later steps

/**
 * Connect command handler
 */
export async function connectCommand(options) {
  let { session, token } = options;

  // Prompt for credentials if not provided
  if (!session || !token) {
    const credentials = await promptForCredentials();
    session = session || credentials.sessionId;
    token = token || credentials.token;
  }

  if (!session || !token) {
    throw new Error('Session ID and token are required');
  }

  // Normalize session ID (frontend CLI uses underscores, backend expects hyphens)
  const sessionId = session.trim().replace(/_/g, '-');

  // Validate credentials format
  const credentialManager = new CredentialManager();
  const validation = credentialManager.validate(sessionId, token);
  if (!validation.valid) {
    throw new Error(validation.sessionIdError || validation.secretError);
  }

  // Store credentials securely
  await credentialManager.store(sessionId, token);

  console.log(chalk.green('✓ Credentials stored securely'));
  console.log(chalk.cyan(`Connecting to backend with session: ${sessionId.substring(0, 20)}...`));

  // Create connection manager
  connectionManager = new ConnectionManager({
    sessionId,
    sessionSecret: token,
  });

  // Connect to backend
  await connectionManager.connect();

  // Create session sandbox - dedicated dir for npm installs, accessible in File Explorer
  const sandboxPath = initSandbox(sessionId);
  const homeDir = path.resolve(path.dirname(sandboxPath));
  console.log(chalk.gray(`  Sandbox: ${sandboxPath}`));
  console.log(chalk.gray(`  Home: ${homeDir}`));

  // execCapabilities: sandbox only (safe for npm install, etc.)
  // listCapabilities: home + sandbox (allow browsing home in File Explorer)
  registerHandlers(connectionManager, {
    onTerminate: () => {
      console.log(chalk.yellow('\nBackend requested shutdown. Disconnecting...'));
    },
    sandboxPath,
    capabilities: [sandboxPath],
    listCapabilities: [homeDir, sandboxPath],
  });

  // Notify backend/frontend of sandbox path for UI display
  connectionManager.send({
    type: 'agent:ready',
    payload: { sandboxPath, homeDir, capabilities: [sandboxPath] },
  });

  console.log(chalk.green('✓ Connected to TRYMINT backend'));
  console.log(chalk.cyan('Agent is ready. Waiting for commands...'));
  console.log(chalk.gray('Press Ctrl+C to disconnect'));

  // Keep process alive
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n\nDisconnecting...'));
    await disconnectCommand();
    process.exit(0);
  });

  // Wait for connection to close
  return new Promise((resolve) => {
    connectionManager.on('disconnected', () => {
      resolve();
    });
  });
}

/**
 * Status command handler
 */
export async function statusCommand() {
  const credentialManager = new CredentialManager();
  const credentials = await credentialManager.get();

  if (!credentials) {
    console.log(chalk.yellow('No active session found'));
    return;
  }

  const status = {
    sessionId: credentials.sessionId,
    connected: connectionManager?.isConnected() || false,
    lastHeartbeat: connectionManager?.getLastHeartbeat() || null,
  };

  formatOutput('status', status);
}

/**
 * Disconnect command handler
 */
export async function disconnectCommand() {
  if (connectionManager) {
    await connectionManager.disconnect();
    connectionManager = null;
  }

  const credentialManager = new CredentialManager();
  await credentialManager.clear();

  console.log(chalk.green('✓ Disconnected and cleaned up'));
}
