/**
 * Postmortem analysis types for TRYMINT.
 * @see CURSOR_BUILD_PROMPT.md - POSTMORTEM COMMAND SPECIFICATIONS
 */

/**
 * @typedef {'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'} RiskLevel
 */

/**
 * @typedef {'critical'|'high'|'medium'|'low'|'info'} FindingSeverity
 */

/**
 * @typedef {'pass'|'warn'|'fail'} CategoryStatus
 */

/**
 * @typedef {'low'|'medium'|'high'} RecommendationEffort
 */

/**
 * @typedef {Object} Finding
 * @property {string} id - Unique finding ID (e.g. CRIT-001)
 * @property {FindingSeverity} severity
 * @property {string} category - e.g. "Runtime Behavior"
 * @property {string} title
 * @property {string} description
 * @property {string} [location] - File path or dependency name
 * @property {string} [evidence] - Code snippet or data
 * @property {string} [cwe] - CWE ID if applicable
 * @property {string} [remediation] - How to fix
 */

/**
 * @typedef {Object} Recommendation
 * @property {number} priority - 1 = most important
 * @property {string} action
 * @property {string} reason
 * @property {RecommendationEffort} effort
 */

/**
 * @typedef {Object} CategoryResult
 * @property {string} name - e.g. "dependencies", "codePatterns"
 * @property {number} score - 0-100
 * @property {number} weight - How much this affects overall score
 * @property {CategoryStatus} status
 * @property {Finding[]} findings
 */

/**
 * @typedef {Object} PostmortemReport
 * @property {string} packageName
 * @property {string} packageVersion
 * @property {Date|string} analyzedAt
 * @property {RiskLevel} overallRisk
 * @property {number} overallScore - 0-100
 * @property {Object} categories
 * @property {CategoryResult} categories.dependencies
 * @property {CategoryResult} categories.codePatterns
 * @property {CategoryResult} categories.behavior
 * @property {CategoryResult} categories.vulnerabilities
 * @property {CategoryResult} categories.licenses
 * @property {CategoryResult} categories.reputation
 * @property {Finding[]} findings
 * @property {Recommendation[]} recommendations
 */
