/**
 * File System Risk Analyzer
 * Static analysis only - no filesystem access, no command execution.
 */

import { extractPathsFromCommand, hasTraversalAttempt, isAbsolutePath, estimatePathScope } from './utils.js';

// Destructive operations with severity (0-100)
const DESTRUCTIVE_PATTERNS = [
  { pattern: /rm\s+-rf|rm\s+-fr|rm\s+-r\s+-f|rm\s+-rf\s/gi, score: 95, name: 'Recursive force delete' },
  { pattern: /\brm\s+-r\b/gi, score: 80, name: 'Recursive delete' },
  { pattern: /\brm\b/gi, score: 60, name: 'File deletion' },
  { pattern: /\brmdir\b|\brd\b/gi, score: 50, name: 'Directory removal' },
  { pattern: /\bmkfs\.|format\s+/gi, score: 100, name: 'Disk format' },
  { pattern: /\bdd\s+if=/gi, score: 90, name: 'Raw disk write' },
  { pattern: /\bchmod\s+-R\b/gi, score: 70, name: 'Recursive chmod' },
  { pattern: /\bchown\s+-R\b/gi, score: 75, name: 'Recursive chown' },
  { pattern: /\bfind\s+.*\s+-delete\b/gi, score: 85, name: 'Find with delete' },
  { pattern: /\btruncate\b/gi, score: 55, name: 'Truncate file' },
];

// Recursive flags (-r, -R, -rf, -fr, --recursive)
const RECURSIVE_FLAGS = [/-r\b/, /-R\b/, /-rf\b/, /-fr\b/, /--recursive/, /-recursive/];

const PACKAGE_COMMAND_PREFIXES = ['npm ', 'yarn ', 'pnpm ', 'npm install', 'npm i ', 'yarn add', 'pnpm add', 'pnpm i '];

export function analyzeFileSystem(command, workingDir) {
  const steps = [];
  const triggers = [];
  let fileCountEstimated = 0;
  let hasRecursive = false;
  let hasTraversal = false;
  let hasAbsolutePath = false;
  let destructivenessScore = 0;

  const lowered = command.toLowerCase();
  const isPackageCommand = PACKAGE_COMMAND_PREFIXES.some((p) => lowered.startsWith(p));

  if (isPackageCommand) {
    steps.push({ check: 'Command type', data: {}, result: 'Package manager command - file analysis skipped for install args' });
    return {
      destructivenessScore: 0,
      fileCountEstimated: 0,
      hasRecursive: false,
      hasTraversal: false,
      hasAbsolutePath: false,
      triggers,
      steps,
    };
  }

  // Step 1: Extract paths
  const paths = extractPathsFromCommand(command);
  steps.push({
    check: 'Path extraction',
    data: { paths, count: paths.length },
    result: `Found ${paths.length} path(s) in command`,
  });

  // Step 2: Check for traversal
  for (const p of paths) {
    if (hasTraversalAttempt(p)) {
      hasTraversal = true;
      triggers.push('Directory traversal attempt detected (../)');
      break;
    }
  }
  steps.push({
    check: 'Traversal detection',
    data: { hasTraversal },
    result: hasTraversal ? 'Traversal attempt detected' : 'No traversal detected',
  });

  // Step 3: Check for absolute paths
  for (const p of paths) {
    if (isAbsolutePath(p)) {
      hasAbsolutePath = true;
      triggers.push('Absolute path used');
      break;
    }
  }
  steps.push({
    check: 'Absolute path detection',
    data: { hasAbsolutePath },
    result: hasAbsolutePath ? 'Absolute path detected' : 'Relative paths only',
  });

  // Step 4: Recursive flags
  hasRecursive = RECURSIVE_FLAGS.some((re) => re.test(command));
  if (hasRecursive) {
    triggers.push('Recursive operation flag (-r, -R, --recursive)');
  }
  steps.push({
    check: 'Recursive flag detection',
    data: { hasRecursive },
    result: hasRecursive ? 'Recursive operation' : 'Non-recursive',
  });

  // Step 5: Estimate file count impact (static - no glob expansion)
  for (const p of paths) {
    fileCountEstimated += estimatePathScope(p);
  }
  if (hasRecursive && fileCountEstimated < 10) {
    fileCountEstimated = 50; // Recursive without specific path = broad impact
  }
  steps.push({
    check: 'File count estimate',
    data: { fileCountEstimated, note: 'Static estimate, no filesystem access' },
    result: `Estimated impact: ~${fileCountEstimated} file(s)`,
  });

  // Step 6: Destructiveness from patterns
  for (const { pattern, score, name } of DESTRUCTIVE_PATTERNS) {
    if (pattern.test(command)) {
      destructivenessScore = Math.max(destructivenessScore, score);
      triggers.push(`Destructive pattern: ${name}`);
    }
  }

  // Non-destructive file ops
  if (destructivenessScore === 0) {
    if (lowered.startsWith('ls') || lowered.startsWith('cat') || lowered.startsWith('head') || lowered.startsWith('tail')) {
      destructivenessScore = 5;
      steps.push({ check: 'Read-only operation', data: {}, result: 'Read-only, low risk' });
    } else if (lowered.startsWith('cp') || lowered.startsWith('mv') || lowered.startsWith('mkdir') || lowered.startsWith('touch')) {
      destructivenessScore = 35;
      steps.push({ check: 'Write operation', data: {}, result: 'File create/modify, moderate risk' });
    }
  }

  // Boost for traversal/absolute
  if (hasTraversal) destructivenessScore = Math.min(100, destructivenessScore + 25);
  if (hasAbsolutePath && hasRecursive) destructivenessScore = Math.min(100, destructivenessScore + 15);

  return {
    destructivenessScore: Math.min(100, destructivenessScore),
    fileCountEstimated,
    hasRecursive,
    hasTraversal,
    hasAbsolutePath,
    triggers,
    steps,
  };
}
