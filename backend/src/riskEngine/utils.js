/**
 * Risk Engine Utilities - Input sanitization, path parsing, injection prevention.
 * No filesystem access. No shell execution.
 */

// Max command length to prevent DoS
const MAX_COMMAND_LENGTH = 10000;

// Null bytes and control chars - always reject
const FORBIDDEN_CHARS = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;

/**
 * Sanitize and validate command input.
 * Rejects null bytes and control chars. Allows normal shell chars for analysis.
 * @returns {{ valid: boolean, sanitized: string, error?: string }}
 */
export function sanitizeCommand(command) {
  if (typeof command !== 'string') {
    return { valid: false, sanitized: '', error: 'Command must be a string' };
  }

  const trimmed = command.trim();
  if (trimmed.length === 0) {
    return { valid: false, sanitized: '', error: 'Command cannot be empty' };
  }

  if (trimmed.length > MAX_COMMAND_LENGTH) {
    return { valid: false, sanitized: '', error: 'Command exceeds maximum length' };
  }

  if (FORBIDDEN_CHARS.test(trimmed)) {
    return { valid: false, sanitized: '', error: 'Command contains invalid characters' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Extract paths from command string (best-effort, no execution).
 * Handles: rm path, cp src dst, mv src dst, chmod path, etc.
 */
export function extractPathsFromCommand(command) {
  const paths = [];
  const tokens = command.split(/\s+/).filter(Boolean);

  const skipFlags = ['-r', '-R', '-rf', '-fr', '-rR', '-f', '--recursive', '--force', '-v'];
  const isNumeric = (s) => /^\d+$/.test(s);

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (skipFlags.includes(token)) continue;
    if (token.startsWith('-')) continue;
    if (isNumeric(token)) continue; // chmod 755, etc.
    if (token.includes('=') && !token.includes('/')) continue; // key=value
    if (token.includes('/') || token === '.' || token === '..') {
      paths.push(token);
    } else if (token.length > 0 && !token.startsWith('-')) {
      paths.push(token); // Potential relative path
    }
  }

  return paths;
}

/**
 * Detect if path suggests directory traversal (../)
 */
export function hasTraversalAttempt(path) {
  if (typeof path !== 'string') return false;
  const normalized = path.replace(/\/+/g, '/');
  return normalized.includes('../') || normalized.startsWith('../');
}

/**
 * Detect if path is absolute (starts with /)
 */
export function isAbsolutePath(path) {
  return typeof path === 'string' && path.startsWith('/');
}

/**
 * Estimate file count from path pattern (e.g. wildcards).
 * Static analysis only - no glob expansion.
 */
export function estimatePathScope(path) {
  let multiplier = 1;
  if (path.includes('*') || path.includes('?')) {
    multiplier = 10; // Wildcard suggests multiple files
  }
  if (path.includes('**')) {
    multiplier = 100; // Recursive glob
  }
  return multiplier;
}
