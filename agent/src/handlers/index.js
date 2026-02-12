/**
 * Message Handlers - Route incoming backend messages to handlers
 *
 * Handles: agent:simulate, agent:execute, execution:cancel, agent:terminate, filesystem:list, agent:postmortem:request
 */

import fs from 'fs';
import path from 'path';
import { simulate } from '../simulation/index.js';
import { execute, cancelExecution } from '../execution/index.js';
import { validateCommand, createEnvironment } from '../isolation/index.js';
import { canAccess } from '../isolation/capabilities.js';
import { handleFilesystemList, handleFilesystemRead } from './filesystem.js';

// Track active execution for cancellation
let activeExecutionId = null;
let cancelRequested = false;

/**
 * Register message handlers on a ConnectionManager
 * @param {ConnectionManager} connection - ConnectionManager instance
 * @param {object} options - Optional callbacks
 * @param {function} options.onTerminate - Called when agent:terminate received
 * @param {string[]} options.capabilities - Allowed directory paths for simulation
 * @param {function} options.executor - Optional executor (for tests); defaults to real PTY execute
 */
export function registerHandlers(connection, options = {}) {
  const { onTerminate, capabilities = [], listCapabilities, sandboxPath, executor } = options;
  const cwd = sandboxPath || process.cwd();
  const listCaps = listCapabilities && listCapabilities.length > 0 ? listCapabilities : capabilities;

  connection.on('message:agent:simulate', (payload) => {
    handleSimulate(connection, payload, capabilities, cwd);
  });

  connection.on('message:agent:execute', (payload) => {
    handleExecute(connection, payload, executor, capabilities, cwd);
  });

  connection.on('message:execution:cancel', (payload) => {
    handleCancel(connection, payload);
  });

  connection.on('message:agent:terminate', () => {
    handleTerminate(connection, onTerminate);
  });

  connection.on('message:filesystem:list', (payload) => {
    handleFilesystemList(connection, payload, listCaps, cwd);
  });

  connection.on('message:filesystem:read', (payload) => {
    handleFilesystemRead(connection, payload, listCaps, cwd);
  });

  connection.on('message:agent:postmortem:request', (payload) => {
    handlePostmortemRequest(connection, payload, listCaps, cwd);
  });
}

/**
 * Handle agent:postmortem:request - read package.json and send data for analysis
 */
async function handlePostmortemRequest(connection, payload, capabilities, cwd) {
  const { path: reqPath = '.' } = payload || {};
  const basePath = (!reqPath || reqPath === '.' || reqPath === '/') ? cwd : path.join(cwd, reqPath);
  const pkgPath = path.join(basePath, 'package.json');

  const caps = capabilities && capabilities.length > 0 ? capabilities : [cwd];
  if (!canAccess(pkgPath, caps, cwd)) {
    connection.send({
      type: 'agent:postmortem:data',
      payload: { error: 'Cannot access package.json in this path' },
    });
    return;
  }

  try {
    const content = fs.readFileSync(pkgPath, 'utf-8');
    const packageJson = JSON.parse(content);
    const files = {};
    // Optionally read main entry files for code pattern analysis
    const mainFile = packageJson.main || packageJson.module || 'index.js';
    const mainPath = path.join(basePath, mainFile);
    if (fs.existsSync(mainPath) && canAccess(mainPath, caps, cwd)) {
      try {
        files[mainFile] = fs.readFileSync(mainPath, 'utf-8');
      } catch {
        // Ignore
      }
    }
    connection.send({
      type: 'agent:postmortem:data',
      payload: { packageJson, files, packagePath: basePath },
    });
  } catch (err) {
    connection.send({
      type: 'agent:postmortem:data',
      payload: { error: err.message || 'Failed to read package.json' },
    });
  }
}

/**
 * Handle agent:simulate - return simulation result
 * Payload: { commandId, command, workingDir }
 */
function handleSimulate(connection, payload, capabilities = [], defaultCwd = process.cwd()) {
  const { commandId, command, workingDir } = payload || {};
  if (!commandId) return;

  const effectiveWorkingDir = (!workingDir || workingDir === '/' || workingDir === '.') ? defaultCwd : workingDir;
  const result = simulate(command, effectiveWorkingDir, capabilities);
  connection.send({
    type: 'simulation:result',
    payload: { commandId, ...result },
  });
}

/**
 * Handle agent:execute - execute command via PTY
 * Payload: { commandId, command, workingDir }
 */
async function handleExecute(connection, payload, executor, capabilities = [], defaultCwd = process.cwd()) {
  const { commandId, command, workingDir } = payload || {};
  if (!commandId || !command) return;

  activeExecutionId = commandId;
  cancelRequested = false;

  const caps = capabilities && capabilities.length > 0 ? capabilities : [defaultCwd];
  const effectiveWorkingDir = (!workingDir || workingDir === '/' || workingDir === '.') ? defaultCwd : workingDir;
  const validation = validateCommand(command, effectiveWorkingDir, caps);
  if (!validation.valid) {
    connection.send({
      type: 'execution:complete',
      payload: {
        commandId,
        exitCode: 1,
        duration: 0,
        error: 'Capability violation',
        violations: validation.violations,
      },
    });
    activeExecutionId = null;
    return;
  }

  const sendFn = (msg) => connection.send(msg);
  const isCancelRequested = () => cancelRequested && activeExecutionId === commandId;
  const runExecute = executor || execute;

  const { env, cwd } = createEnvironment(caps, effectiveWorkingDir);

  try {
    const result = await runExecute(
      command,
      cwd,
      commandId,
      sendFn,
      isCancelRequested,
      { env }
    );

    connection.send({
      type: 'execution:complete',
      payload: {
        commandId,
        exitCode: result.exitCode,
        duration: result.duration,
        ...(result.cancelled && { cancelled: true }),
      },
    });
  } catch (err) {
    connection.send({
      type: 'execution:complete',
      payload: {
        commandId,
        exitCode: 1,
        duration: 0,
        error: err.message,
      },
    });
  } finally {
    if (activeExecutionId === commandId) {
      activeExecutionId = null;
      cancelRequested = false;
    }
  }
}

/**
 * Handle execution:cancel - cancel running execution
 * Payload: { commandId }
 */
function handleCancel(connection, payload) {
  const { commandId } = payload || {};
  if (commandId && commandId === activeExecutionId) {
    cancelRequested = true;
    cancelExecution();
  }
}

/**
 * Handle agent:terminate - graceful shutdown
 */
async function handleTerminate(connection, onTerminate) {
  if (typeof onTerminate === 'function') {
    onTerminate();
  }
  await connection.disconnect();
}

/**
 * For Step 6: set active execution (called by execution module)
 */
export function setActiveExecution(id) {
  activeExecutionId = id;
}

/**
 * For Step 6: clear active execution
 */
export function clearActiveExecution() {
  activeExecutionId = null;
  cancelRequested = false;
}

/**
 * For Step 6: check if cancel was requested
 */
export function isCancelRequested() {
  return cancelRequested;
}
