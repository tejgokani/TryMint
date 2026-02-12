/**
 * Execution Coordinator - PTY spawn, stream output, report completion
 */

import { spawn } from './pty.js';
import { createStream } from './stream.js';
import * as lifecycle from './lifecycle.js';

export { spawn } from './pty.js';
export { createStream } from './stream.js';
export * from './lifecycle.js';

/**
 * Cancel currently running execution (called when execution:cancel received)
 */
export function cancelExecution() {
  lifecycle.cancel();
}

/**
 * Execute a command and stream output via sendFn
 * @param {string} command - Shell command
 * @param {string} workingDir - Working directory
 * @param {string} commandId - Command ID for messages
 * @param {function} sendFn - (msg) => void - sends to backend
 * @param {function} isCancelRequested - () => boolean
 * @param {object} options - Optional { env } for sandbox
 * @returns {Promise<{exitCode: number, duration: number, cancelled?: boolean}>}
 */
export async function execute(command, workingDir, commandId, sendFn, isCancelRequested, options = {}) {
  const startTime = Date.now();
  const outputStream = createStream(commandId, sendFn);

  lifecycle.start(commandId);

  const cwd = workingDir || process.cwd();
  const spawnOpts = { cwd, env: options.env || process.env };

  const ptyProcess = spawn(command, spawnOpts);
  lifecycle.running(ptyProcess, commandId);

  return new Promise((resolve) => {
    let resolved = false;
    const done = (exitCode, cancelled = false) => {
      if (resolved) return;
      resolved = true;
      outputStream.flush();
      outputStream.end();
      lifecycle.cleanup();
      const duration = Date.now() - startTime;
      resolve({ exitCode, duration, cancelled });
    };

    const cancelCheck = setInterval(() => {
      if (isCancelRequested && isCancelRequested()) {
        clearInterval(cancelCheck);
        ptyProcess.kill('SIGTERM');
      }
    }, 100);

    ptyProcess.onData((data) => {
      if (isCancelRequested && isCancelRequested()) {
        ptyProcess.kill('SIGTERM');
        return;
      }
      outputStream.write(data);
    });

    ptyProcess.onExit(({ exitCode, signal }) => {
      clearInterval(cancelCheck);
      const cancelled = isCancelRequested && isCancelRequested();
      const code = exitCode !== undefined && exitCode !== null ? exitCode : (signal ? 128 + 15 : 0);
      done(cancelled ? 143 : code, cancelled);
    });

    if (isCancelRequested && isCancelRequested()) {
      ptyProcess.kill('SIGTERM');
    }
  });
}
