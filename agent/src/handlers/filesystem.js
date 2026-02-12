/**
 * Filesystem handler - List directory contents for File Explorer
 */

import fs from 'fs';
import path from 'path';
import { canAccess } from '../isolation/capabilities.js';
import { resolvePath } from '../isolation/paths.js';

/**
 * Handle filesystem:list - list directory contents
 * Payload: { path } - path to list (relative or absolute)
 */
export function handleFilesystemList(connection, payload, capabilities, cwd) {
  const { path: reqPath } = payload || {};
  const targetPath = reqPath === '' || reqPath === '/' || !reqPath
    ? cwd
    : resolvePath(reqPath, cwd);

  const caps = capabilities && capabilities.length > 0 ? capabilities : [cwd];
  const parentOfCwd = path.dirname(cwd);
  const targetNorm = targetPath.replace(/\/+$/, '') || targetPath;
  const parentNorm = parentOfCwd.replace(/\/+$/, '') || parentOfCwd;

  const allowed =
    canAccess(targetPath, caps, cwd) ||
    targetNorm === parentNorm ||
    targetNorm.startsWith(parentNorm + '/');

  if (!allowed) {
    connection.send({
      type: 'filesystem:list:result',
      payload: {
        path: reqPath || '.',
        error: 'Capability violation',
        entries: [],
      },
    });
    return;
  }

  try {
    const stat = fs.statSync(targetPath);
    if (!stat.isDirectory()) {
      connection.send({
        type: 'filesystem:list:result',
        payload: { path: reqPath || '.', error: 'Not a directory', entries: [] },
      });
      return;
    }
    const raw = fs.readdirSync(targetPath, { withFileTypes: true });
    const seen = new Set();
    const entries = raw
      .filter((e) => {
        if (seen.has(e.name)) return false;
        seen.add(e.name);
        return true;
      })
      .map((e) => ({
        name: e.name,
        isDirectory: e.isDirectory(),
      }))
      .sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });

    connection.send({
      type: 'filesystem:list:result',
      payload: {
        path: reqPath || '.',
        entries,
      },
    });
  } catch (err) {
    connection.send({
      type: 'filesystem:list:result',
      payload: {
        path: reqPath || '.',
        error: err.message || 'Failed to list directory',
        entries: [],
      },
    });
  }
}

/**
 * Handle filesystem:read - read file contents
 * Payload: { path } - path to file (relative or absolute)
 */
export function handleFilesystemRead(connection, payload, capabilities, cwd) {
  const { path: reqPath } = payload || {};
  if (!reqPath) {
    connection.send({
      type: 'filesystem:content',
      payload: { path: '', error: 'path is required' },
    });
    return;
  }

  const targetPath = resolvePath(reqPath, cwd);

  const caps = capabilities && capabilities.length > 0 ? capabilities : [cwd];
  const parentOfCwd = path.dirname(cwd);
  const targetNorm = targetPath.replace(/\/+$/, '') || targetPath;
  const parentNorm = parentOfCwd.replace(/\/+$/, '') || parentOfCwd;

  const allowed =
    canAccess(targetPath, caps, cwd) ||
    targetNorm === parentNorm ||
    targetNorm.startsWith(parentNorm + '/');

  if (!allowed) {
    connection.send({
      type: 'filesystem:content',
      payload: { path: reqPath, error: 'Capability violation' },
    });
    return;
  }

  try {
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      connection.send({
        type: 'filesystem:content',
        payload: { path: reqPath, error: 'Is a directory' },
      });
      return;
    }
    const content = fs.readFileSync(targetPath, 'utf-8');
    connection.send({
      type: 'filesystem:content',
      payload: { path: reqPath, content, encoding: 'utf-8' },
    });
  } catch (err) {
    connection.send({
      type: 'filesystem:content',
      payload: { path: reqPath, error: err.message || 'Failed to read file' },
    });
  }
}
