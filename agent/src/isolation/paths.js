/**
 * Path Validation Utilities - Resolve, normalize, detect escape
 */

import { resolve, dirname } from 'path';
import { realpathSync } from 'fs';
import { homedir } from 'os';

/**
 * Resolve path to absolute (handles ~, ., .., redundant slashes)
 */
export function resolvePath(pathStr, cwd = process.cwd()) {
  if (!pathStr || typeof pathStr !== 'string') return cwd;
  const trimmed = pathStr.trim();
  if (!trimmed) return cwd;

  // Expand ~ to home (fallback: homedir() or parent of cwd)
  const home = process.env.HOME || process.env.USERPROFILE || homedir() || dirname(cwd);
  const expanded = trimmed.replace(/^~/, home);

  // Normalize and resolve
  const resolved = resolve(cwd, expanded);
  return resolved;
}

/**
 * Alias for resolvePath
 */
export function normalize(pathStr, cwd = process.cwd()) {
  return resolvePath(pathStr, cwd);
}

/**
 * Check if child is within parent (or equal)
 * Uses resolved absolute paths
 */
export function isSubPath(child, parent, cwd = process.cwd()) {
  if (!child || !parent) return false;
  const resolvedChild = resolvePath(child, cwd);
  const resolvedParent = resolvePath(parent, cwd);
  return resolvedChild === resolvedParent || resolvedChild.startsWith(resolvedParent + '/');
}

/**
 * Resolve symlinks to real path (sync)
 */
export function followSymlinks(path, cwd = process.cwd()) {
  try {
    const abs = resolvePath(path, cwd);
    return realpathSync(abs);
  } catch {
    return resolvePath(path, cwd);
  }
}

/**
 * Detect if path escapes from root (e.g. ../ traversal)
 * @param {string} path - Path to check
 * @param {string} root - Root directory
 * @returns {boolean} true if path escapes root
 */
export function detectEscape(path, root, cwd = process.cwd()) {
  if (!path || !root) return false;
  const resolvedPath = resolvePath(path, cwd);
  const resolvedRoot = resolvePath(root, cwd);
  return !isSubPath(resolvedPath, resolvedRoot, cwd);
}
