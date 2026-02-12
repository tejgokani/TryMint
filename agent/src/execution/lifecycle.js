/**
 * Execution Lifecycle - Track state and cleanup
 */

const STATES = { PENDING: 'PENDING', STARTING: 'STARTING', RUNNING: 'RUNNING', COMPLETED: 'COMPLETED', CANCELLED: 'CANCELLED', FAILED: 'FAILED' };

let currentState = STATES.PENDING;
let currentPty = null;

export function getState() {
  return currentState;
}

export function start(commandId) {
  currentState = STATES.STARTING;
  return currentState;
}

export function running(pty, commandId) {
  currentState = STATES.RUNNING;
  currentPty = pty;
  return currentState;
}

export function complete() {
  currentState = STATES.COMPLETED;
  currentPty = null;
  return currentState;
}

export function failed() {
  currentState = STATES.FAILED;
  currentPty = null;
  return currentState;
}

export function cancel() {
  if (currentPty && currentState === STATES.RUNNING) {
    try {
      currentPty.kill('SIGTERM');
    } catch {}
    currentPty = null;
  }
  currentState = STATES.CANCELLED;
  return currentState;
}

export function cleanup() {
  if (currentPty) {
    try {
      currentPty.kill('SIGKILL');
    } catch {}
    currentPty = null;
  }
  currentState = STATES.PENDING;
}

export function getCurrentPty() {
  return currentPty;
}

export { STATES };
