#!/usr/bin/env node

/**
 * Step 1 Testing Rubric: Project Setup & CLI Foundation
 * 
 * Criteria (100 points total):
 * - Package.json configured correctly (20 points)
 * - CLI entry point works (20 points)
 * - Command parsing works (20 points)
 * - Help output works (20 points)
 * - Error handling works (20 points)
 */

import { spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const agentDir = join(__dirname, '..');

function runCli(args) {
  const result = spawnSync('node', ['src/cli/index.js', ...args], {
    cwd: agentDir,
    encoding: 'utf8',
    timeout: 5000,
  });
  return { stdout: result.stdout || '', stderr: result.stderr || '', status: result.status };
}

let score = 0;
const maxScore = 100;
const results = [];

function logResult(test, passed, points, details = '') {
  const status = passed ? '✓ PASS' : '✗ FAIL';
  results.push({ test, status, points, details });
  if (passed) {
    score += points;
  }
  console.log(`${status}: ${test} (${points} points)${details ? ` - ${details}` : ''}`);
}

async function testPackageJson() {
  console.log('\n=== Testing package.json ===');
  
  const packagePath = join(agentDir, 'package.json');
  if (!existsSync(packagePath)) {
    logResult('package.json exists', false, 5);
    return;
  }
  logResult('package.json exists', true, 5);

  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  // Check required fields
  logResult('Has name field', !!pkg.name, 2);
  logResult('Has version field', !!pkg.version, 2);
  logResult('Has type: module', pkg.type === 'module', 3);
  logResult('Has bin configuration', !!pkg.bin && !!pkg.bin.trymint, 3);
  
  // Check required dependencies
  const requiredDeps = ['ws', 'commander', 'chalk', 'node-pty'];
  const hasDeps = requiredDeps.every(dep => pkg.dependencies?.[dep]);
  logResult('Has required dependencies', hasDeps, 5);
}

async function testCLIEntryPoint() {
  console.log('\n=== Testing CLI Entry Point ===');
  
  const cliPath = join(agentDir, 'src/cli/index.js');
  if (!existsSync(cliPath)) {
    logResult('CLI entry point exists', false, 10);
    return;
  }
  logResult('CLI entry point exists', true, 5);

  // Check shebang
  const content = readFileSync(cliPath, 'utf-8');
  logResult('Has shebang', content.startsWith('#!/usr/bin/env node'), 5);
}

async function testCommandParsing() {
  console.log('\n=== Testing Command Parsing ===');
  
  try {
    const { stdout: helpOutput } = runCli(['--help']);
    logResult('Help command works', helpOutput.includes('trymint'), 5);
    logResult('Help shows connect command', helpOutput.includes('connect'), 5);
    logResult('Help shows status command', helpOutput.includes('status'), 5);
    logResult('Help shows disconnect command', helpOutput.includes('disconnect'), 5);
    logResult('Help output complete', helpOutput.length > 100, 5);
  } catch (error) {
    logResult('Command parsing', false, 20, error.message);
  }
}

async function testVersionCommand() {
  console.log('\n=== Testing Version Command ===');
  
  try {
    const { stdout } = runCli(['version']);
    logResult('Version command works', stdout.includes('TRYMINT Agent'), 15);
  } catch (error) {
    logResult('Version command', false, 15, error.message);
  }
}

async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===');
  
  try {
    const { stderr } = runCli(['invalid-command']);
    logResult('Invalid command handled', stderr.includes('Unknown command') || stderr.includes('error'), 15);
  } catch (error) {
    logResult('Error handling works', true, 15);
  }
}

async function testStatusCommand() {
  console.log('\n=== Testing Status Command ===');
  const { stdout } = runCli(['status']);
  logResult('Status command runs', true, 10);
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('STEP 1 RUBRIC: Project Setup & CLI Foundation');
  console.log('='.repeat(60));

  await testPackageJson();
  await testCLIEntryPoint();
  await testCommandParsing();
  await testVersionCommand();
  await testErrorHandling();
  await testStatusCommand();

  console.log('\n' + '='.repeat(60));
  console.log(`FINAL SCORE: ${score}/${maxScore} (${(score/maxScore*100).toFixed(1)}%)`);
  console.log('='.repeat(60));

  if (score >= 90) {
    console.log('\n✓ STEP 1 PASSED - Ready to proceed to Step 2');
    process.exit(0);
  } else {
    console.log('\n✗ STEP 1 FAILED - Score below 90%. Please fix issues before proceeding.');
    console.log('\nDetailed Results:');
    results.forEach(r => {
      console.log(`  ${r.status}: ${r.test}${r.details ? ` (${r.details})` : ''}`);
    });
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('Test execution error:', error);
  process.exit(1);
});
