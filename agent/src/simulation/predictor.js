/**
 * Effect Predictor - Predict file/system effects from parsed command
 */

const FILE_READ_COMMANDS = ['cat', 'less', 'head', 'tail', 'more', 'wc', 'grep', 'find'];
const FILE_WRITE_COMMANDS = ['tee', 'echo'];
const FILE_CREATE_COMMANDS = ['touch', 'mkdir'];
const FILE_DELETE_COMMANDS = ['rm', 'rmdir', 'unlink'];
const FILE_MOVE_COMMANDS = ['mv'];
const FILE_COPY_COMMANDS = ['cp'];
const PERMISSION_COMMANDS = ['chmod', 'chown', 'chgrp'];
const NETWORK_COMMANDS = ['curl', 'wget', 'ssh', 'scp'];
const PROCESS_COMMANDS = ['kill', 'pkill', 'killall'];

/**
 * Predict all effects from parsed command
 * @param {object} parsed - Parsed command from parser
 * @param {string} workingDir - Working directory context
 */
export function predict(parsed, workingDir = '.') {
  const effects = [];
  const cmd = parsed.command || '';

  effects.push(...predictFileChanges(parsed, workingDir));
  effects.push(...predictCreations(parsed, workingDir));
  effects.push(...predictDeletions(parsed, workingDir));
  effects.push(...predictPermissionChanges(parsed, workingDir));

  if (NETWORK_COMMANDS.includes(cmd)) {
    effects.push({ type: 'NETWORK', target: cmd });
  }
  if (PROCESS_COMMANDS.includes(cmd)) {
    effects.push({ type: 'PROCESS', target: cmd });
  }

  return effects;
}

export function predictFileChanges(parsed, workingDir) {
  const effects = [];
  const cmd = parsed.command || '';

  if (FILE_READ_COMMANDS.includes(cmd)) {
    const target = parsed.paths[0] || workingDir;
    effects.push({ type: 'READ_FILE', target });
  }

  if (parsed.hasRedirect && (cmd === 'echo' || cmd === 'cat' || cmd === '')) {
    effects.push({ type: 'FILE_WRITE', target: parsed.paths[0] || 'unknown' });
  }

  return effects;
}

export function predictCreations(parsed, workingDir) {
  const effects = [];
  const cmd = parsed.command || '';

  if (FILE_CREATE_COMMANDS.includes(cmd)) {
    const target = parsed.paths[0] || parsed.args[0] || workingDir;
    effects.push({ type: 'FILE_CREATE', target });
  }

  return effects;
}

export function predictDeletions(parsed, workingDir) {
  const effects = [];
  const cmd = parsed.command || '';

  if (FILE_DELETE_COMMANDS.includes(cmd)) {
    parsed.paths.forEach((p) => effects.push({ type: 'FILE_DELETE', target: p }));
  }

  return effects;
}

export function predictPermissionChanges(parsed, workingDir) {
  const effects = [];
  const cmd = parsed.command || '';

  if (PERMISSION_COMMANDS.includes(cmd)) {
    effects.push({ type: 'PERMISSION_CHANGE', target: parsed.paths[0] || 'unknown' });
  }

  return effects;
}
