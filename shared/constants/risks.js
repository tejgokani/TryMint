/**
 * Risk levels and categories for TRYMINT.
 * @see CURSOR_BUILD_PROMPT.md - Postmortem Analysis Rubrics
 */

/** @type {readonly string[]} */
export const RISK_LEVELS = Object.freeze(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

/** @type {readonly string[]} */
export const FINDING_SEVERITIES = Object.freeze([
  'critical',
  'high',
  'medium',
  'low',
  'info',
])

/** @type {readonly string[]} */
export const POSTMORTEM_CATEGORIES = Object.freeze([
  'dependencies',
  'codePatterns',
  'behavior',
  'vulnerabilities',
  'licenses',
  'reputation',
])

/** Severity to numeric order for sorting */
export const SEVERITY_ORDER = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
}
