/**
 * PTY Session Management - Spawn and control shell processes
 */

import pty from 'node-pty';
import { platform } from 'os';

const DEFAULT_SHELL = platform() === 'win32' ? 'powershell.exe' : '/bin/sh';

/**
 * Spawn a PTY process with the given command
 * @param {string} command - Shell command to execute
 * @param {object} options - { cwd, env, cols, rows }
 * @returns {object} PTY process with write, kill, on, resize
 */
export function spawn(command, options = {}) {
  const { cwd = process.cwd(), env = process.env, cols = 80, rows = 24 } = options;

  const shell = options.shell || DEFAULT_SHELL;
  const args = platform() === 'win32' ? ['-Command', command] : ['-c', command];

  const ptyProcess = pty.spawn(shell, args, {
    name: 'xterm-256color',
    cols,
    rows,
    cwd,
    env: { ...env },
  });

  return {
    pid: ptyProcess.pid,
    write: (data) => ptyProcess.write(data),
    resize: (cols, rows) => ptyProcess.resize(cols, rows),
    kill: (signal = 'SIGTERM') => ptyProcess.kill(signal),
    onData: (callback) => {
      ptyProcess.onData(callback);
    },
    onExit: (callback) => {
      ptyProcess.onExit(callback);
    },
    _pty: ptyProcess,
  };
}
