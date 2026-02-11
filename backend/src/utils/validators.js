// Very lightweight input validators. For now we avoid pulling in a full schema lib.

import { ValidationError } from './errors.js';

export function requireFields(obj, fields) {
  const missing = fields.filter((f) => obj[f] === undefined || obj[f] === null || obj[f] === '');
  if (missing.length) {
    throw new ValidationError(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCommandPayload(payload) {
  requireFields(payload, ['command', 'workingDir']);
  if (!isNonEmptyString(payload.command) || !isNonEmptyString(payload.workingDir)) {
    throw new ValidationError('Invalid command or workingDir');
  }
}

export function validateExecutionPayload(payload) {
  requireFields(payload, ['commandId']);
  if (!isNonEmptyString(payload.commandId)) {
    throw new ValidationError('Invalid commandId');
  }
}

