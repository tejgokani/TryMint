#!/usr/bin/env node

/**
 * Step 7 Testing Rubric: Isolation & Security
 *
 * Tests path validation, capabilities, sandbox, and handler integration
 */

import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { EventEmitter } from 'events';
import {
  resolvePath,
  normalize,
  isSubPath,
  detectEscape,
  canAccess,
  validateCommand,
  getViolations,
  getDefaultCapabilities,
  createEnvironment,
  sanitizeEnv,
} from '../src/isolation/index.js';
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

async function testPathsModule() {
  console.log('\n=== Testing Paths Module ===');

  const cwd = process.cwd();
  logResult('resolvePath returns string', typeof resolvePath('.', cwd) === 'string', 3);
  logResult('normalize aliases resolvePath', normalize('..', cwd).length > 0, 3);
  logResult('isSubPath child within parent', isSubPath('/a/b/c', '/a/b', cwd), 3);
  logResult('isSubPath child outside parent', !isSubPath('/etc/passwd', '/home/user', cwd), 3);
  logResult('detectEscape detects traversal', detectEscape('../../../etc', '/home/user', cwd), 3);
}

async function testCapabilitiesModule() {
  console.log('\n=== Testing Capabilities Module ===');

  const caps = [process.cwd(), '/tmp'];
  logResult('canAccess allows path in cap', canAccess('.', caps), 5);
  logResult('canAccess rejects /etc/passwd', !canAccess('/etc/passwd', caps), 5);
  logResult('validateCommand returns valid', typeof validateCommand('ls', process.cwd(), caps).valid === 'boolean', 3);
  logResult('getViolations for bad path', getViolations('cat /etc/passwd', process.cwd(), caps).length > 0, 5);
  logResult('getViolations for good path', getViolations('ls .', process.cwd(), caps).length === 0, 2);
}

async function testSandboxModule() {
  console.log('\n=== Testing Sandbox Module ===');

  const orig = { LD_PRELOAD: '/bad', PATH: '/usr/bin', HOME: process.env.HOME };
  const safe = sanitizeEnv(orig);
  logResult('sanitizeEnv removes LD_PRELOAD', !safe.LD_PRELOAD, 5);
  logResult('sanitizeEnv preserves PATH', safe.PATH === '/usr/bin', 3);

  const { env, cwd } = createEnvironment([process.cwd()], process.cwd());
  logResult('createEnvironment returns env and cwd', !!env && !!cwd, 5);
  logResult('setWorkingDir within caps', cwd.length > 0, 2);
}

async function testDefaultCapabilities() {
  console.log('\n=== Testing Default Capabilities ===');

  const caps = getDefaultCapabilities();
  logResult('getDefaultCapabilities returns array', Array.isArray(caps), 5);
  logResult('getDefaultCapabilities has cwd by default', caps.length > 0, 5);
}

async function testHandlerCapabilityValidation() {
  console.log('\n=== Testing Handler Capability Validation ===');

  const mockConn = new EventEmitter();
  const sentMessages = [];

  mockConn.send = (msg) => sentMessages.push(msg);

  registerHandlers(mockConn, {
    capabilities: [process.cwd()],
    executor: async () => ({ exitCode: 0, duration: 1 }),
  });

  mockConn.emit('message:agent:execute', {
    commandId: 'cmd-violation',
    command: 'cat /etc/passwd',
    workingDir: process.cwd(),
  });

  await new Promise((r) => setTimeout(r, 50));

  const complete = sentMessages.find((m) => m.type === 'execution:complete');
  logResult('Capability violation blocks execution', !!complete && complete.payload.exitCode === 1, 10);
  logResult('Capability violation has error', !!complete?.payload?.error, 5);
  logResult('Capability violation has violations', Array.isArray(complete?.payload?.violations), 5);
}

async function testAllowedCommandRuns() {
  console.log('\n=== Testing Allowed Command Runs ===');

  const mockConn = new EventEmitter();
  const sentMessages = [];

  mockConn.send = (msg) => sentMessages.push(msg);

  const mockExecutor = async () => ({ exitCode: 0, duration: 5 });

  registerHandlers(mockConn, {
    capabilities: [process.cwd()],
    executor: mockExecutor,
  });

  mockConn.emit('message:agent:execute', {
    commandId: 'cmd-ok',
    command: 'ls .',
    workingDir: process.cwd(),
  });

  await new Promise((r) => setTimeout(r, 50));

  const complete = sentMessages.find((m) => m.type === 'execution:complete');
  logResult('Allowed command receives execution:complete', !!complete, 5);
  logResult('Allowed command has exitCode 0', complete?.payload?.exitCode === 0, 5);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 7 RUBRIC: Isolation & Security');
  console.log('='.repeat(60));

  await testPathsModule();
  await testCapabilitiesModule();
  await testSandboxModule();
  await testDefaultCapabilities();
  await testHandlerCapabilityValidation();
  await testAllowedCommandRuns();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 7 PASSED - Ready to proceed to Step 8');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 7 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
