#!/usr/bin/env node

/**
 * Step 5 Testing Rubric: Command Simulation
 *
 * Tests parser, predictor, validator, simulate(), and agent:simulate handler
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  parse,
  extractCommand,
  extractArgs,
  extractPaths,
  detectPipes,
  detectRedirects,
  predict,
  validate,
  simulate,
  calculateRiskLevel,
  checkDangerousPatterns,
} from '../src/simulation/index.js';
import { registerHandlers } from '../src/handlers/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentDir = join(__dirname, '..');

let score = 0;
const maxScore = 110;

function logResult(test, passed, points, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  if (passed) score += points;
  console.log(`${status}: ${test} (${points} points)${details ? ` - ${details}` : ''}`);
}

async function testParser() {
  console.log('\n=== Testing Parser ===');

  const p1 = parse('ls -la /tmp');
  logResult('parse returns object', p1 && typeof p1 === 'object', 3);
  logResult('parse extracts command', p1.command === 'ls', 3);
  logResult('parse extracts args', Array.isArray(p1.args) && p1.args.includes('-la'), 3);
  logResult('parse extracts paths', p1.paths && p1.paths.includes('/tmp'), 3);

  logResult('detectPipes for piped cmd', detectPipes('cat foo | grep bar'), 2);
  logResult('detectPipes for non-piped', !detectPipes('ls -la'), 2);
  logResult('detectRedirects for redirect', detectRedirects('echo hi > out.txt'), 2);
  logResult('detectRedirects for non-redirect', !detectRedirects('ls'), 2);
}

async function testPredictor() {
  console.log('\n=== Testing Predictor ===');

  const pCat = parse('cat /etc/passwd');
  const effectsCat = predict(pCat, '/tmp');
  logResult('predict FILE_READ for cat', effectsCat.some((e) => e.type === 'READ_FILE' || e.type === 'FILE_READ'), 5);

  const pRm = parse('rm -rf /tmp/foo');
  const effectsRm = predict(pRm, '/tmp');
  logResult('predict FILE_DELETE for rm', effectsRm.some((e) => e.type === 'FILE_DELETE'), 5);

  const pMkdir = parse('mkdir newdir');
  const effectsMkdir = predict(pMkdir, '/tmp');
  logResult('predict FILE_CREATE for mkdir', effectsMkdir.some((e) => e.type === 'FILE_CREATE'), 5);

  const pTouch = parse('touch file.txt');
  const effectsTouch = predict(pTouch, '/tmp');
  logResult('predict effects for touch', effectsTouch.length > 0, 5);
}

async function testValidator() {
  console.log('\n=== Testing Validator ===');

  logResult('calculateRiskLevel LOW for ls', calculateRiskLevel(parse('ls -la')) === 'LOW', 5);
  logResult('calculateRiskLevel MEDIUM for sudo', calculateRiskLevel(parse('sudo apt update')) === 'MEDIUM', 5);
  logResult('calculateRiskLevel HIGH for rm -rf', calculateRiskLevel(parse('rm -rf /')) === 'HIGH', 5);

  logResult('checkDangerousPatterns rm -rf', checkDangerousPatterns('rm -rf /tmp'), 5);
  logResult('checkDangerousPatterns safe ls', !checkDangerousPatterns('ls -la'), 3);

  const val = validate(parse('ls -la'), ['/tmp', '/home']);
  logResult('validate returns canExecute', typeof val.canExecute === 'boolean', 2);
}

async function testSimulate() {
  console.log('\n=== Testing simulate() ===');

  const r1 = simulate('ls -la', '/tmp');
  logResult('simulate returns result', r1 && r1.success !== undefined, 5);
  logResult('simulate has riskLevel', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(r1.riskLevel), 5);
  logResult('simulate has effects array', Array.isArray(r1.effects), 3);
  logResult('simulate has warnings array', Array.isArray(r1.warnings), 3);
  logResult('simulate has canExecute', typeof r1.canExecute === 'boolean', 4);

  const r2 = simulate('rm -rf /', '/tmp');
  logResult('simulate HIGH risk for rm -rf', r2.riskLevel === 'HIGH', 5);
  logResult('simulate canExecute false for dangerous', r2.canExecute === false, 5);
}

async function testAgentSimulate() {
  console.log('\n=== Testing agent:simulate Handler ===');

  // Direct emit test - verify handler runs and sends simulation:result
  const { EventEmitter } = await import('events');
  const mockConn = new EventEmitter();
  const sentMessages = [];
  mockConn.send = (msg) => sentMessages.push(msg);

  registerHandlers(mockConn);
  mockConn.emit('message:agent:simulate', { commandId: 'cmd-sim-1', command: 'ls -la', workingDir: '/tmp' });

  const result = sentMessages.find((m) => m.type === 'simulation:result');
  logResult('agent:simulate handler sends simulation:result', !!result, 7);
  logResult('simulation:result has commandId', result?.payload?.commandId === 'cmd-sim-1', 4);
  logResult('simulation:result has riskLevel', !!result?.payload?.riskLevel, 4);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 5 RUBRIC: Command Simulation');
  console.log('='.repeat(60));

  await testParser();
  await testPredictor();
  await testValidator();
  await testSimulate();
  await testAgentSimulate();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 5 PASSED - Ready to proceed to Step 6');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 5 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
