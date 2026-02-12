/**
 * Capability Checker - Validate command access against directory capabilities
 */

import { parse } from '../simulation/parser.js';
import { resolvePath, isSubPath } from './paths.js';

/**
 * Check if a path is allowed by capabilities
 * @param {string} path - Path to check
 * @param {string[]} capabilities - Allowed directory paths
 * @param {string} cwd - Working directory for resolution
 * @returns {boolean}
 */
export function canAccess(path, capabilities = [], cwd = process.cwd()) {
  if (!Array.isArray(capabilities) || capabilities.length === 0) return true;
  if (capabilities.includes('*')) return true;

  const resolved = resolvePath(path, cwd);
  const resolvedNorm = resolved.replace(/\/+$/, '');
  return capabilities.some((cap) => {
    const resolvedCap = resolvePath(cap, cwd);
    const capNorm = resolvedCap.replace(/\/+$/, '');
    return (
      resolvedNorm === capNorm ||
      resolvedNorm.startsWith(capNorm + '/') ||
      isSubPath(resolved, resolvedCap, cwd)
    );
  });
}

/**
 * Extract paths from command (uses simulation parser)
 */
export function extractPathsFromCommand(command) {
  const parsed = parse(command);
  return parsed.paths || [];
}

/**
 * Validate command against capabilities
 * @returns {{ valid: boolean, violations: string[] }}
 */
export function validateCommand(command, workingDir, capabilities = []) {
  const violations = getViolations(command, workingDir, capabilities);
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * Get list of path violations
 */
export function getViolations(command, workingDir, capabilities = []) {
  if (!Array.isArray(capabilities) || capabilities.length === 0) return [];
  if (capabilities.includes('*')) return [];

  const cwd = workingDir || process.cwd();
  const paths = extractPathsFromCommand(command);

  const violations = [];
  for (const p of paths) {
    if (!canAccess(p, capabilities, cwd)) {
      violations.push(resolvePath(p, cwd));
    }
  }

  if (workingDir && !canAccess(workingDir, capabilities, process.cwd())) {
    violations.push(resolvePath(workingDir, process.cwd()));
  }

  return [...new Set(violations)];
}
