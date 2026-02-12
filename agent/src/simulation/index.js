/**
 * Simulation Coordinator - Parse, predict, validate, return result
 */

import { parse } from './parser.js';
import { predict } from './predictor.js';
import { validate, generateWarnings, calculateRiskLevel } from './validator.js';

export { parse, extractCommand, extractArgs, extractPaths, detectPipes, detectRedirects } from './parser.js';
export { predict, predictFileChanges, predictCreations, predictDeletions, predictPermissionChanges } from './predictor.js';
export { validate, checkCapabilities, checkDangerousPatterns, calculateRiskLevel, generateWarnings } from './validator.js';

/**
 * Run full simulation on a command
 * @param {string} command - Raw command string
 * @param {string} workingDir - Working directory
 * @param {string[]} capabilities - Allowed directory paths
 * @returns {object} Simulation result matching backend format
 */
export function simulate(command, workingDir = '.', capabilities = []) {
  if (!command || typeof command !== 'string') {
    return {
      success: false,
      riskLevel: 'HIGH',
      effects: [],
      warnings: ['Invalid or empty command'],
      canExecute: false,
    };
  }

  const parsed = parse(command);
  const effects = predict(parsed, workingDir);
  const validation = validate(parsed, capabilities);

  return {
    success: true,
    riskLevel: validation.riskLevel,
    effects,
    warnings: validation.warnings,
    violations: validation.violations || [],
    canExecute: validation.canExecute,
    parsed: {
      command: parsed.command,
      args: parsed.args,
      paths: parsed.paths,
      hasPipe: parsed.hasPipe,
      hasRedirect: parsed.hasRedirect,
    },
  };
}
