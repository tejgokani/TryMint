/**
 * Safety Validator - Check dangerous patterns and calculate risk
 */

const HIGH_RISK_PATTERNS = [
  'rm -rf',
  'rm -r /',
  'rm -rf /',
  'mkfs',
  ':(){:|:&};:',
  'shutdown',
  'reboot',
  'dd if=/dev/zero',
  '> /dev/sda',
  '> /dev/sdb',
];

const MEDIUM_RISK_PATTERNS = ['sudo', 'chown', 'chmod', 'apt', 'yum', 'brew', 'npm run'];

/**
 * Full validation - check patterns and calculate risk
 */
export function validate(parsed, capabilities = []) {
  const warnings = generateWarnings(parsed);
  const violations = checkCapabilities(parsed.paths || [], capabilities);
  const riskLevel = calculateRiskLevel(parsed);

  return {
    riskLevel,
    warnings,
    violations,
    canExecute: riskLevel !== 'HIGH' && riskLevel !== 'CRITICAL' && violations.length === 0,
  };
}

/**
 * Check if paths are within allowed capabilities
 */
export function checkCapabilities(paths, capabilities) {
  if (!Array.isArray(capabilities) || capabilities.length === 0) return [];
  // Simplified: if we have capabilities, any path outside is a violation
  const violations = [];
  for (const path of paths) {
    const normalized = path.replace(/^~/, process.env.HOME || '');
    const inCap = capabilities.some((cap) => normalized.startsWith(cap) || cap === '*');
    if (!inCap && path.startsWith('/')) {
      violations.push(path);
    }
  }
  return violations;
}

/**
 * Check for dangerous patterns in raw command
 */
export function checkDangerousPatterns(command) {
  const lowered = (command || '').toLowerCase();
  return HIGH_RISK_PATTERNS.some((p) => lowered.includes(p));
}

/**
 * Calculate risk level from parsed command
 */
export function calculateRiskLevel(parsed) {
  const raw = (parsed.raw || '').toLowerCase();
  const cmd = parsed.command || '';

  if (HIGH_RISK_PATTERNS.some((p) => raw.includes(p))) {
    return 'HIGH';
  }
  if (MEDIUM_RISK_PATTERNS.some((p) => raw.includes(p))) {
    return 'MEDIUM';
  }
  if (['rm', 'rmdir', 'chmod', 'chown'].includes(cmd)) {
    return 'MEDIUM';
  }
  if (['curl', 'wget', 'ssh'].includes(cmd)) {
    return 'MEDIUM';
  }

  return 'LOW';
}

/**
 * Generate warnings for the command
 */
export function generateWarnings(parsed) {
  const warnings = [];
  const raw = (parsed.raw || '').toLowerCase();
  const cmd = parsed.command || '';

  if (HIGH_RISK_PATTERNS.some((p) => raw.includes(p))) {
    warnings.push('Command appears destructive.');
  }
  if (MEDIUM_RISK_PATTERNS.some((p) => raw.includes(p))) {
    warnings.push('Command may require elevated privileges or modify system state.');
  }
  if (parsed.hasPipe && ['rm', 'mv', 'cp'].includes(cmd)) {
    warnings.push('Piped command with file operation - verify intent.');
  }

  return warnings;
}
