#!/usr/bin/env node

/**
 * Step 6 Testing Rubric: Command Execution
 *
 * Tests PTY execution, output streaming, lifecycle, and handler integration
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { EventEmitter } from 'events';
import {
  spawn,
  createStream,
  execute,
  cancelExecution,
  getState,
  STATES,
  start,
  complete,
} from '../src/execution/index.js';
import { registerHandlers } from '../src/handlers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentDir = join(__dirname, '..');

let score = 0;
const maxScore = 100;

function logResult(test, passed, points, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  if (passed) score += points;
  console.log(`${status}: ${test} (${points} points)${details ? ` - ${details}` : ''}`);
}

async function testExecutionModule() {
  console.log('\n=== Testing Execution Module ===');

  logResult('execution/pty.js exists', existsSync(join(agentDir, 'src/execution/pty.js')), 3);
  logResult('execution/stream.js exists', existsSync(join(agentDir, 'src/execution/stream.js')), 3);
  logResult('execution/lifecycle.js exists', existsSync(join(agentDir, 'src/execution/lifecycle.js')), 3);
  logResult('spawn exported', typeof spawn === 'function', 3);
  logResult('createStream exported', typeof createStream === 'function', 3);
  logResult('execute exported', typeof execute === 'function', 5);
}

async function testCreateStream() {
  console.log('\n=== Testing Output Stream ===');

  const sent = [];
  const stream = createStream('cmd-1', (msg) => sent.push(msg));

  stream.write('hello');
  stream.write('\n');
  stream.flush();

  logResult('createStream write + flush sends execution:output', sent.some((m) => m.type === 'execution:output'), 10);
  logResult('execution:output has commandId', sent[0]?.payload?.commandId === 'cmd-1', 5);
  logResult('execution:output has data', !!sent[0]?.payload?.data, 5);
}

async function testLifecycle() {
  console.log('\n=== Testing Lifecycle ===');

  logResult('getState returns state', typeof getState() === 'string', 3);
  logResult('STATES has RUNNING', STATES.RUNNING === 'RUNNING', 3);
  logResult('lifecycle.start sets STARTING', start('cmd-1') === STATES.STARTING, 3);
  logResult('lifecycle.complete sets COMPLETED', complete() === STATES.COMPLETED, 3);
  logResult('cancelExecution exists', typeof cancelExecution === 'function', 3);
}

async function testHandlerWithMockExecutor() {
  console.log('\n=== Testing Handler with Mock Executor ===');

  const mockConn = new EventEmitter();
  const sentMessages = [];

  mockConn.send = (msg) => sentMessages.push(msg);

  const mockExecutor = async (command, workingDir, commandId, sendFn, isCancelRequested) => {
    sendFn({ type: 'execution:output', payload: { commandId, data: 'mock output\n', stream: 'stdout' } });
    return { exitCode: 0, duration: 10 };
  };

  registerHandlers(mockConn, { executor: mockExecutor });
  mockConn.emit('message:agent:execute', {
    commandId: 'cmd-exec-1',
    command: 'echo test',
    workingDir: process.cwd(),
  });

  await new Promise((r) => setTimeout(r, 50));

  const output = sentMessages.find((m) => m.type === 'execution:output');
  const complete = sentMessages.find((m) => m.type === 'execution:complete');

  logResult('Mock executor triggers execution:output', !!output, 5);
  logResult('Mock executor triggers execution:complete', !!complete, 10);
  logResult('execution:complete has exitCode', typeof complete?.payload?.exitCode === 'number', 5);
  logResult('execution:complete has duration', typeof complete?.payload?.duration === 'number', 5);
}

async function testRealPtyIfAvailable() {
  console.log('\n=== Testing Real PTY (if available) ===');

  let ptyWorks = false;
  try {
    const sent = [];
    const result = await execute(
      'echo pty-test',
      process.cwd(),
      'cmd-pty',
      (msg) => sent.push(msg),
      () => false
    );
    ptyWorks = result.exitCode === 0 && sent.some((m) => m.type === 'execution:output');
  } catch {
    // PTY may fail in sandbox
  }

  logResult('Real PTY executes command', ptyWorks, 15);
}

async function testCancelIntegration() {
  console.log('\n=== Testing Cancel Integration ===');

  const mockConn = new EventEmitter();
  const sentMessages = [];

  mockConn.send = (msg) => sentMessages.push(msg);

  let resolveExecute;
  const executePromise = new Promise((r) => { resolveExecute = r; });
  const mockExecutor = async (command, workingDir, commandId, sendFn, isCancelRequested) => {
    return executePromise;
  };

  registerHandlers(mockConn, { executor: mockExecutor });
  mockConn.emit('message:agent:execute', {
    commandId: 'cmd-cancel-1',
    command: 'sleep 100',
    workingDir: process.cwd(),
  });

  await new Promise((r) => setTimeout(r, 20));
  mockConn.emit('message:execution:cancel', { commandId: 'cmd-cancel-1' });
  resolveExecute({ exitCode: 143, duration: 100, cancelled: true });

  await new Promise((r) => setTimeout(r, 50));

  const complete = sentMessages.find((m) => m.type === 'execution:complete');
  logResult('Cancel flow sends execution:complete', !!complete, 5);
  logResult('Cancel flow handles cancelled', complete?.payload?.cancelled === true || complete?.payload?.exitCode === 143, 5);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 6 RUBRIC: Command Execution');
  console.log('='.repeat(60));

  await testExecutionModule();
  await testCreateStream();
  await testLifecycle();
  await testHandlerWithMockExecutor();
  await testRealPtyIfAvailable();
  await testCancelIntegration();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 6 PASSED - Ready to proceed to Step 7');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 6 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
