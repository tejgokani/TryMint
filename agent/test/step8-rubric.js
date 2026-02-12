#!/usr/bin/env node

/**
 * Step 8 Testing Rubric: Integration with Backend
 *
 * Requires backend running at TRYMINT_BACKEND_URL (default http://localhost:3000)
 * Run: npm run dev (in backend) before this test
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import WebSocket from 'ws';
import { ConnectionManager } from '../src/connection/index.js';
import { registerHandlers } from '../src/handlers/index.js';
import { getDefaultCapabilities } from '../src/isolation/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.TRYMINT_BACKEND_URL || 'http://localhost:3000';
const WS_URL = BASE_URL.replace(/^http/, 'ws');

let score = 0;
const maxScore = 100;

function logResult(test, passed, points, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  if (passed) score += points;
  console.log(`${status}: ${test} (${points} points)${details ? ` - ${details}` : ''}`);
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function getSessionCredentials() {
  const loginRes = await fetchWithTimeout(`${BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@trymint.io', password: 'test123' }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const { data: loginData } = await loginRes.json();
  const token = loginData.token;

  const sessionRes = await fetchWithTimeout(`${BASE_URL}/v1/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  if (!sessionRes.ok) throw new Error(`Session failed: ${sessionRes.status}`);
  const { data: sessionData } = await sessionRes.json();
  return { sessionId: sessionData.sessionId, sessionSecret: sessionData.sessionSecret };
}

async function testBackendReachable() {
  console.log('\n=== Backend Reachability ===');

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/v1/health`, {}, 3000);
    logResult('Backend health endpoint responds', res.ok, 15);
  } catch (e) {
    logResult('Backend reachable', false, 15, 'Backend not running? Start with: cd backend && npm run dev');
    return false;
  }
  return true;
}

async function testAuthAndSession() {
  console.log('\n=== Auth & Session ===');

  try {
    const creds = await getSessionCredentials();
    logResult('Login returns JWT', true, 5);
    logResult('Session creation returns credentials', !!(creds.sessionId && creds.sessionSecret), 10);
    return creds;
  } catch (e) {
    logResult('Auth flow', false, 15, e.message);
    return null;
  }
}

async function testAgentConnect(creds) {
  console.log('\n=== Agent WebSocket Connect ===');

  if (!creds) return null;

  return new Promise((resolve) => {
    const cm = new ConnectionManager({
      sessionId: creds.sessionId,
      sessionSecret: creds.sessionSecret,
    });

    const orig = process.env.TRYMINT_WS_URL;
    process.env.TRYMINT_WS_URL = BASE_URL;

    const timeout = setTimeout(() => {
      logResult('Agent connects to backend', false, 15, 'Timeout');
      process.env.TRYMINT_WS_URL = orig;
      resolve(null);
    }, 5000);

    cm.on('connected', () => {
      clearTimeout(timeout);
      logResult('Agent connects to backend', true, 15);
      process.env.TRYMINT_WS_URL = orig;
      resolve({ cm, creds });
    });

    cm.on('error', (err) => {
      clearTimeout(timeout);
      logResult('Agent connects to backend', false, 15, err.message);
      process.env.TRYMINT_WS_URL = orig;
      resolve(null);
    });

    cm.connect();
  });
}

async function testFullCommandFlow(agentResult) {
  console.log('\n=== Full Command Flow ===');

  if (!agentResult) return;

  const { cm, creds } = agentResult;

  return new Promise((resolve) => {
    const uiWs = new WebSocket(
      `${WS_URL}/ws/ui?sessionId=${encodeURIComponent(creds.sessionId)}&sessionSecret=${encodeURIComponent(creds.sessionSecret)}`
    );

    const received = { simulation: null, executionComplete: null, executionOutput: null };
    let scored = false;
    const scoreFn = () => {
      if (scored) return;
      scored = true;
      logResult('UI receives simulation:result', !!received.simulation, 8);
      logResult('UI receives execution:complete', !!received.executionComplete, 12);
      logResult('execution:complete has exitCode', typeof received.executionComplete?.payload?.exitCode === 'number', 5);
      logResult('execution:complete has commandId', !!received.executionComplete?.payload?.commandId, 5);
      logResult('UI receives execution:output or complete', !!received.executionOutput || !!received.executionComplete, 5);
    };
    const timeout = setTimeout(() => {
      uiWs.close();
      cm.disconnect();
      scoreFn();
      resolve();
    }, 8000);

    uiWs.on('open', () => {
      registerHandlers(cm, { capabilities: getDefaultCapabilities() });

      uiWs.on('message', (data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'simulation:result') received.simulation = msg;
          if (msg.type === 'execution:complete') received.executionComplete = msg;
          if (msg.type === 'execution:output') received.executionOutput = msg;
        } catch {}
      });

      uiWs.send(
        JSON.stringify({
          type: 'command:submit',
          payload: { command: 'echo integration-test', workingDir: process.cwd() },
        })
      );

      setTimeout(() => {
        if (received.simulation?.payload?.commandId) {
          uiWs.send(
            JSON.stringify({
              type: 'command:approve',
              payload: { commandId: received.simulation.payload.commandId },
            })
          );
        }
      }, 500);
    });

    uiWs.on('close', () => {
      clearTimeout(timeout);
      scoreFn();
      cm.disconnect();
      resolve();
    });

    uiWs.on('error', () => {
      clearTimeout(timeout);
      logResult('Full command flow', false, 35, 'UI WebSocket error');
      cm.disconnect();
      resolve();
    });
  });
}

async function testCliConnectWithRealBackend() {
  console.log('\n=== CLI Connect (dry run) ===');

  const { spawnSync } = await import('child_process');
  const agentDir = join(__dirname, '..');

  const result = spawnSync(
    'node',
    ['src/cli/index.js', 'connect', '--session', 'sess-invalid', '--token', 'short'],
    { cwd: agentDir, encoding: 'utf8', timeout: 5000 }
  );

  const output = (result.stdout || '') + (result.stderr || '');
  logResult('CLI connect rejects invalid creds', result.status !== 0, 5);
  logResult('CLI reports error for invalid', output.includes('invalid') || output.includes('Error') || output.includes('required'), 5);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 8 RUBRIC: Integration with Backend');
  console.log('='.repeat(60));
  console.log(`\nBackend URL: ${BASE_URL}`);
  console.log('Ensure backend is running: cd backend && npm run dev\n');

  const reachable = await testBackendReachable();
  if (!reachable) {
    console.log('\n' + '='.repeat(60));
    console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
    console.log('='.repeat(60));
    console.log('\n⚠ Backend not reachable. Start backend and re-run.');
    console.log('  Remaining tests skipped.\n');
    process.exit(score >= 90 ? 0 : 1);
  }

  const creds = await testAuthAndSession();
  const agentResult = await testAgentConnect(creds);
  await testFullCommandFlow(agentResult);
  await testCliConnectWithRealBackend();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 8 PASSED - Agent integration complete');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 8 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
