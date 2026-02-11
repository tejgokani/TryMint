import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Crypto-safe token generation helpers

export function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function compareHash(token, hash) {
  return hashToken(token) === hash;
}

export function generateSessionId() {
  return `sess-${uuidv4()}`;
}

export function generateCommandId() {
  return `cmd-${uuidv4()}`;
}

export function generateAgentId() {
  return `agent-${uuidv4()}`;
}

