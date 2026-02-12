#!/usr/bin/env node

/**
 * Step 3 Testing Rubric: WebSocket Connection
 *
 * Tests ConnectionManager against a mock WebSocket server.
 */

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { WebSocketServer } from 'ws';
import { ConnectionManager } from '../src/connection/index.js';

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

function createMockServer() {
  return new Promise((resolve) => {
    const wss = new WebSocketServer({ port: 0 }, () => {
      resolve({ wss, port: wss.address().port });
    });
  });
}

async function testConnectionManagerExists() {
  console.log('\n=== Testing ConnectionManager Module ===');

  const connPath = join(agentDir, 'src/connection/index.js');
  logResult('Connection module exists', existsSync(connPath), 5);
  logResult('ConnectionManager class exported', typeof ConnectionManager === 'function', 5);
}

async function testUrlConstruction() {
  console.log('\n=== Testing URL Construction ===');

  const cm = new ConnectionManager({
    sessionId: 'sess-abc-123',
    sessionSecret: 'secret-token-20chars',
  });

  const url = cm.getWsUrl();
  logResult('getWsUrl returns string', typeof url === 'string', 5);
  logResult('URL contains /ws/agent', url.includes('/ws/agent'), 5);
  logResult('URL contains sessionId param', url.includes('sessionId='), 5);
  logResult('URL contains sessionSecret param', url.includes('sessionSecret='), 5);
  logResult('URL uses ws protocol', url.startsWith('ws://'), 5);
}

async function testConnectAndDisconnect() {
  console.log('\n=== Testing Connect & Disconnect ===');

  const { wss, port } = await createMockServer();

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'agent:connected', payload: { agentId: 'test' } }));
  });

  const cm = new ConnectionManager({
    sessionId: 'sess-test-' + Date.now(),
    sessionSecret: 'x'.repeat(20),
  });

  const originalEnv = process.env.TRYMINT_WS_URL;
  process.env.TRYMINT_WS_URL = `http://localhost:${port}`;

  try {
    await cm.connect();
    logResult('Connect succeeds', cm.isConnected(), 10);

    await cm.disconnect();
    logResult('Disconnect succeeds', !cm.isConnected(), 10);
  } catch (err) {
    logResult('Connect/disconnect flow', false, 20, err.message);
  } finally {
    process.env.TRYMINT_WS_URL = originalEnv;
    wss.close();
  }
}

async function testMessageHandling() {
  console.log('\n=== Testing Message Handling ===');

  const { wss, port } = await createMockServer();
  let messageReceived = false;

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'agent:connected', payload: { test: true } }));
  });

  const cm = new ConnectionManager({
    sessionId: 'sess-msg-test',
    sessionSecret: 'y'.repeat(20),
  });

  const originalEnv = process.env.TRYMINT_WS_URL;
  process.env.TRYMINT_WS_URL = `http://localhost:${port}`;

  try {
    const msgPromise = new Promise((resolve) => {
      cm.once('message:agent:connected', () => {
        messageReceived = true;
        resolve();
      });
    });

    await cm.connect();
    await Promise.race([msgPromise, new Promise((r) => setTimeout(r, 2000))]);

    logResult('agent:connected message received', messageReceived, 10);
    logResult('getLastHeartbeat set after connect', cm.getLastHeartbeat() !== null, 5);
  } catch (err) {
    logResult('Message handling', false, 15, err.message);
  } finally {
    await cm.disconnect();
    process.env.TRYMINT_WS_URL = originalEnv;
    wss.close();
  }
}

async function testSendMessage() {
  console.log('\n=== Testing Send ===');

  const { wss, port } = await createMockServer();
  const sentMessages = [];

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'agent:connected', payload: {} }));
    ws.on('message', (data) => {
      try {
        sentMessages.push(JSON.parse(data.toString()));
      } catch {}
    });
  });

  const cm = new ConnectionManager({
    sessionId: 'sess-send-test',
    sessionSecret: 'z'.repeat(20),
  });

  const originalEnv = process.env.TRYMINT_WS_URL;
  process.env.TRYMINT_WS_URL = `http://localhost:${port}`;

  try {
    await cm.connect();

    cm.send({ type: 'agent:heartbeat', payload: { status: 'online' } });
    await new Promise((r) => setTimeout(r, 50));

    const heartbeat = sentMessages.find((m) => m.type === 'agent:heartbeat');
    logResult('send() transports message', !!heartbeat, 10);
    logResult('Message structure correct', heartbeat?.payload?.status === 'online', 5);

    await cm.disconnect();
    cm.send({ type: 'test' });
    logResult('send() no-op when disconnected', sentMessages.length === 1, 5);
  } catch (err) {
    logResult('Send flow', false, 20, err.message);
  } finally {
    process.env.TRYMINT_WS_URL = originalEnv;
    wss.close();
  }
}

async function testCliConnectCommand() {
  console.log('\n=== Testing CLI Connect (requires backend) ===');

  const { stdout, stderr, status } = spawnSync(
    'node',
    ['src/cli/index.js', 'connect', '--session', 'sess-invalid', '--token', 'short'],
    { cwd: agentDir, encoding: 'utf8', timeout: 5000 }
  );

  const output = stdout + stderr;
  logResult('Connect rejects invalid credentials', status !== 0, 5);
  logResult('Connect reports validation error', output.includes('invalid') || output.includes('required') || output.includes('Error'), 5);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 3 RUBRIC: WebSocket Connection');
  console.log('='.repeat(60));

  await testConnectionManagerExists();
  await testUrlConstruction();
  await testConnectAndDisconnect();
  await testMessageHandling();
  await testSendMessage();
  await testCliConnectCommand();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${((score / maxScore) * 100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 3 PASSED - Ready to proceed to Step 4');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 3 FAILED - Score below 90%.');
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error('Test execution error:', error);
  process.exit(1);
});
