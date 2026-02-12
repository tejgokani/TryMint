#!/usr/bin/env node

/**
 * Step 2 Testing Rubric: Credential Management
 */

import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { CredentialManager, validateSessionId, validateSessionSecret } from '../src/credentials/index.js';

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

async function testValidation() {
  console.log('\n=== Testing Credential Validation ===');
  
  logResult('validateSessionId accepts valid format', validateSessionId('sess-abc123-def456'), 5);
  logResult('validateSessionId accepts UUID-like', validateSessionId('sess-e416595e-0e78-4216-8ccb'), 3);
  logResult('validateSessionId rejects invalid format', !validateSessionId('invalid'), 5);
  logResult('validateSessionId rejects empty', !validateSessionId(''), 3);
  logResult('validateSessionSecret accepts long secret', validateSessionSecret('a'.repeat(20)), 5);
  logResult('validateSessionSecret rejects short secret', !validateSessionSecret('short'), 5);
  logResult('validateSessionSecret rejects null', !validateSessionSecret(null), 2);
}

async function testStorage() {
  console.log('\n=== Testing Credential Storage ===');
  
  const cm = new CredentialManager();
  const testSessionId = 'sess-test-' + 'a'.repeat(20);
  const testToken = 'secret-token-' + 'a'.repeat(20);

  try {
    await cm.store(testSessionId, testToken);
    logResult('Store credentials', true, 5);

    const creds = await cm.get();
    logResult('Retrieve credentials', creds && creds.sessionId === testSessionId, 10);
    logResult('Credentials have token', creds && creds.token === testToken, 5);
    logResult('Credentials have storedAt', creds && typeof creds.storedAt === 'number', 5);

    await cm.clear();
    const afterClear = await cm.get();
    logResult('Clear credentials', afterClear === null, 10);
  } catch (error) {
    logResult('Storage operations', false, 30, error.message);
  }
}

async function testStoreValidation() {
  console.log('\n=== Testing Store Validation ===');
  
  const cm = new CredentialManager();
  
  try {
    await cm.store('invalid', 'short');
    logResult('Store rejects invalid', false, 10);
  } catch {
    logResult('Store rejects invalid session ID', true, 5);
  }

  try {
    await cm.store('sess-valid-id-here', 'short');
    logResult('Store rejects short token', false, 10);
  } catch {
    logResult('Store rejects short token', true, 5);
  }

  const validation = cm.validate('sess-valid', 'x'.repeat(20));
  logResult('validate() returns result', validation && typeof validation.valid === 'boolean', 5);
  logResult('validate() correct for valid creds', cm.validate('sess-abc-123', 'secret20chars!!!!').valid, 5);
  const invalidValidation = cm.validate('bad', 'short');
  logResult('validate() includes error messages for invalid', invalidValidation && (invalidValidation.sessionIdError || invalidValidation.secretError), 5);
}

async function testPersistence() {
  console.log('\n=== Testing Persistence ===');
  const cm = new CredentialManager();
  const sid = 'sess-persist-' + Date.now();
  const tok = 'token-' + 'x'.repeat(20);
  await cm.store(sid, tok);
  const cm2 = new CredentialManager();
  const creds = await cm2.get();
  logResult('Credentials persist across instances', creds && creds.sessionId === sid, 10);
  await cm.clear();
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 2 RUBRIC: Credential Management');
  console.log('='.repeat(60));

  await testValidation();
  await testStorage();
  await testStoreValidation();
  await testPersistence();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${(score/maxScore*100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 2 PASSED - Ready to proceed to Step 3');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 2 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
