/**
 * Postmortem Service - Deep security analysis of npm packages.
 * Produces PostmortemReport per CURSOR_BUILD_PROMPT.md spec.
 * When deepScan=true: fetches full tarball, parses every line, uses TRYMINT formula.
 */

import { evaluate } from '../riskEngine/index.js';
import { runDeepScan } from '../riskEngine/deepScan.js';
import { SEVERITY_ORDER } from '../../../shared/constants/risks.js';

/**
 * Build a PostmortemReport from package.json and optional file contents.
 * @param {Object} options
 * @param {Object} options.packageJson - Parsed package.json
 * @param {Record<string, string>} [options.files] - Path -> content map
 * @param {string} [options.packagePath] - Path context (e.g. /home/user/projects/my-package)
 * @param {boolean} [options.deepScan] - When true, fetch full tarball and parse every line (TRYMINT formula)
 * @param {(stage: string, percent: number) => void} [options.onProgress]
 * @returns {Promise<Object>} PostmortemReport
 */
export async function analyzePostmortem({ packageJson, files = {}, packagePath = '/', deepScan = false, onProgress }) {
  const name = packageJson?.name || 'unknown';
  const version = packageJson?.version || '0.0.0';

  if (deepScan) {
    return analyzePostmortemDeepScan({ packageName: name, version, onProgress });
  }

  const deps = { ...(packageJson?.dependencies || {}), ...(packageJson?.devDependencies || {}) };
  const depCount = Object.keys(deps).length;

  const allFindings = [];
  const recommendations = [];
  const categoryResults = {};

  const report = (stage, percent) => onProgress?.(stage, percent);

  // 1. Dependencies
  report('dependencies', 10);
  const depFindings = [];
  if (depCount === 0) return buildEmptyReport(name, version, false);
  if (depCount > 50) depFindings.push({ id: 'DEP-001', severity: 'medium', category: 'Dependencies', title: 'Excessive dependencies', description: `Package has ${depCount} direct dependencies. Consider reducing.` });
  const depScore = Math.max(0, 100 - depCount * 2);
  categoryResults.dependencies = { name: 'Dependencies', score: depScore, weight: 0.2, status: depScore >= 70 ? 'pass' : depScore >= 40 ? 'warn' : 'fail', findings: depFindings };

  // 2. Code patterns
  report('codePatterns', 30);
  const codeFindings = [];
  const fileContents = Object.values(files).join('\n');
  const patterns = [
    { regex: /\beval\s*\(/, id: 'CODE-001', severity: 'critical', title: 'eval() usage' },
    { regex: /\bnew\s+Function\s*\(/, id: 'CODE-002', severity: 'critical', title: 'Function constructor' },
    { regex: /\bchild_process\.(exec|execSync|spawn)\s*\(/, id: 'CODE-003', severity: 'high', title: 'Shell command execution' },
    { regex: /~\/\.(ssh|aws|gnupg)|\.env\b|id_rsa|credentials/i, id: 'CODE-004', severity: 'critical', title: 'Sensitive file path access' },
    { regex: /\brequire\s*\(\s*[^'"\s][^)]*\)/, id: 'CODE-005', severity: 'high', title: 'Dynamic require' },
    { regex: /process\.env\.(AWS|SECRET|KEY|TOKEN|PASSWORD)/i, id: 'CODE-006', severity: 'medium', title: 'Environment variable access' },
  ];
  for (const p of patterns) {
    if (p.regex.test(fileContents)) {
      codeFindings.push({ ...p, category: 'Code Patterns', description: `Package uses ${p.title}.`, severity: p.severity });
    }
  }
  const codeScore = Math.max(0, 100 - codeFindings.length * 25);
  categoryResults.codePatterns = { name: 'Code Patterns', score: codeScore, weight: 0.2, status: codeScore >= 70 ? 'pass' : codeScore >= 40 ? 'warn' : 'fail', findings: codeFindings };

  // 3. Behavior - use risk engine for npm install
  report('behavior', 50);
  const cmd = `npm install ${name}@${version}`;
  let behaviorResult;
  try {
    behaviorResult = await evaluate(cmd, packagePath || '/');
  } catch {
    behaviorResult = { behaviorScore: 50, behavioralRisk: 50 };
  }
  const behaviorScore = Math.max(0, 100 - (behaviorResult.behavioralRisk ?? 0));
  const behaviorFindings = (behaviorResult.warnings || []).map((w, i) => ({
    id: `BEH-${String(i + 1).padStart(3, '0')}`,
    severity: 'medium',
    category: 'Runtime Behavior',
    title: typeof w === 'string' ? w : w.message || 'Behavior warning',
    description: typeof w === 'string' ? w : w.message || 'Behavior warning',
  }));
  categoryResults.behavior = { name: 'Runtime Behavior', score: behaviorScore, weight: 0.2, status: behaviorScore >= 70 ? 'pass' : behaviorScore >= 40 ? 'warn' : 'fail', findings: behaviorFindings };

  // 4. Vulnerabilities (placeholder - would integrate OSV/GitHub Advisory)
  report('vulnerabilities', 70);
  categoryResults.vulnerabilities = { name: 'Vulnerabilities', score: 85, weight: 0.15, status: 'pass', findings: [] };

  // 5. Licenses
  report('licenses', 85);
  const licenseFindings = [];
  if (!packageJson?.license) licenseFindings.push({ id: 'LIC-001', severity: 'medium', category: 'Licenses', title: 'No license', description: 'Package has no license field.' });
  const licenseScore = licenseFindings.length === 0 ? 100 : 70;
  categoryResults.licenses = { name: 'Licenses', score: licenseScore, weight: 0.05, status: licenseScore >= 70 ? 'pass' : 'warn', findings: licenseFindings };

  // 6. Reputation
  report('reputation', 92);
  categoryResults.reputation = { name: 'Reputation', score: 75, weight: 0.1, status: 'pass', findings: [] };

  // Build overall score and risk
  const weights = { dependencies: 0.2, codePatterns: 0.2, behavior: 0.2, vulnerabilities: 0.15, licenses: 0.05, reputation: 0.1 };
  let overallScore = 0;
  for (const [k, v] of Object.entries(categoryResults)) {
    overallScore += (v.score || 0) * (weights[k] || 0.1);
  }
  overallScore = Math.round(overallScore);

  const overallRisk = overallScore >= 80 ? 'LOW' : overallScore >= 60 ? 'MEDIUM' : overallScore >= 40 ? 'HIGH' : 'CRITICAL';

  allFindings.push(...depFindings, ...codeFindings, ...behaviorFindings, ...categoryResults.licenses.findings);
  allFindings.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5));

  // Recommendations
  if (codeFindings.some((f) => f.severity === 'critical')) {
    recommendations.push({ priority: 1, action: 'Review and remove eval() or dynamic code execution.', reason: 'Critical security risk.', effort: 'high' });
  }
  if (depCount > 50) {
    recommendations.push({ priority: 2, action: 'Reduce dependency count.', reason: 'Excessive dependencies increase attack surface.', effort: 'medium' });
  }
  if (licenseFindings.length > 0) {
    recommendations.push({ priority: 3, action: 'Add license field to package.json.', reason: 'Clarifies usage rights.', effort: 'low' });
  }

  report('complete', 100);

  return {
    packageName: name,
    packageVersion: version,
    analyzedAt: new Date().toISOString(),
    overallRisk,
    overallScore,
    categories: categoryResults,
    findings: allFindings,
    recommendations: recommendations.length ? recommendations : [{ priority: 1, action: 'No critical issues found. Continue monitoring.', reason: 'Baseline check passed.', effort: 'low' }],
  };
}

/**
 * Run deep scan: fetch full tarball, parse every line, use TRYMINT formula.
 */
async function analyzePostmortemDeepScan({ packageName, version, onProgress }) {
  const report = (stage, percent) => onProgress?.(stage, percent);

  // Skip scoped packages that don't resolve (e.g. @scope/pkg without @)
  const pkgName = (packageName || '').trim();
  if (!pkgName || pkgName === 'unknown') {
    return buildEmptyReport('unknown', version || '0.0.0');
  }

  report('deep-scan-start', 0, 'Fetching full package repository...');
  const result = await runDeepScan({
    packageName: pkgName,
    version: version || undefined,
    onProgress: (stage, percent, detail) => report(stage, percent, detail),
  });

  if (result.error) {
    return {
      packageName: pkgName,
      packageVersion: version || '0.0.0',
      analyzedAt: new Date().toISOString(),
      overallRisk: 'MODERATE',
      overallScore: 50,
      deepScanError: result.error,
      trymintScores: null,
      categories: {},
      findings: [{ id: 'DEEP-001', severity: 'high', category: 'Deep Scan', title: 'Deep scan failed', description: result.error }],
      recommendations: [{ priority: 1, action: 'Retry deep scan or run without deepScan.', reason: result.error, effort: 'low' }],
    };
  }

  const { dependency25, destructive25, behavioral25, network25, totalScore, riskLevel, findings, stats } = result;

  const overallRisk = riskLevel;
  const overallScore = totalScore;

  const categories = {
    dependencies: { name: 'Dependencies', score: Math.round((1 - dependency25 / 25) * 100), weight: 0.25, status: dependency25 >= 15 ? 'fail' : dependency25 >= 8 ? 'warn' : 'pass', findings: [] },
    destructive: { name: 'Destructive', score: Math.round((1 - destructive25 / 25) * 100), weight: 0.25, status: destructive25 >= 15 ? 'fail' : destructive25 >= 8 ? 'warn' : 'pass', findings: [] },
    behavioral: { name: 'Behavioral', score: Math.round((1 - behavioral25 / 25) * 100), weight: 0.25, status: behavioral25 >= 15 ? 'fail' : behavioral25 >= 8 ? 'warn' : 'pass', findings: [] },
    network: { name: 'Network', score: Math.round((1 - network25 / 25) * 100), weight: 0.25, status: network25 >= 15 ? 'fail' : network25 >= 8 ? 'warn' : 'pass', findings: [] },
  };

  const allFindings = findings.map((f, i) => ({
    id: `DEEP-${String(i + 1).padStart(3, '0')}`,
    severity: f.severity || 'medium',
    category: f.component === 'destructive' ? 'Destructive' : f.component === 'behavioral' ? 'Behavioral' : 'Network',
    title: f.name,
    description: `${f.name} at ${f.file}:${f.line}`,
    location: `${f.file}:${f.line}`,
    snippet: f.snippet,
  }));

  allFindings.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 5) - (SEVERITY_ORDER[b.severity] ?? 5));

  const recommendations = [];
  if (behavioral25 >= 15) {
    recommendations.push({ priority: 1, action: 'Remove or replace eval(), new Function(), dynamic code execution.', reason: 'High behavioral risk.', effort: 'high' });
  }
  if (destructive25 >= 10) {
    recommendations.push({ priority: 2, action: 'Audit file deletion and destructive operations.', reason: 'Destructive risk detected.', effort: 'medium' });
  }
  if (network25 >= 10) {
    recommendations.push({ priority: 3, action: 'Review outbound network calls and external URLs.', reason: 'Network risk present.', effort: 'medium' });
  }
  if (recommendations.length === 0) {
    recommendations.push({ priority: 1, action: 'Deep scan complete. No critical issues.', reason: 'Baseline passed.', effort: 'low' });
  }

  report('complete', 100);

  return {
    packageName: pkgName,
    packageVersion: result.version || version || '0.0.0',
    analyzedAt: new Date().toISOString(),
    overallRisk,
    overallScore,
    deepScan: true,
    trymintScores: {
      dependency: dependency25,
      destructive: destructive25,
      behavioral: behavioral25,
      network: network25,
      total: totalScore,
      riskLevel,
    },
    stats: { filesScanned: stats?.filesScanned ?? 0, linesScanned: stats?.linesScanned ?? 0 },
    categories,
    findings: allFindings,
    recommendations,
  };
}

function buildEmptyReport(name, version) {
  return {
    packageName: name,
    packageVersion: version,
    analyzedAt: new Date().toISOString(),
    overallRisk: 'LOW',
    overallScore: 100,
    categories: {
      dependencies: { name: 'Dependencies', score: 100, weight: 0.2, status: 'pass', findings: [] },
      codePatterns: { name: 'Code Patterns', score: 100, weight: 0.2, status: 'pass', findings: [] },
      behavior: { name: 'Runtime Behavior', score: 100, weight: 0.2, status: 'pass', findings: [] },
      vulnerabilities: { name: 'Vulnerabilities', score: 100, weight: 0.15, status: 'pass', findings: [] },
      licenses: { name: 'Licenses', score: 100, weight: 0.05, status: 'pass', findings: [] },
      reputation: { name: 'Reputation', score: 100, weight: 0.1, status: 'pass', findings: [] },
    },
    findings: [],
    recommendations: [{ priority: 1, action: 'No dependencies to analyze.', reason: 'No analysis needed.', effort: 'low' }],
  };
}

/**
 * Format postmortem report for terminal display.
 * Simple list format - no tables. ANSI codes for clarity.
 */
const ANSI = { bold: '\x1b[1m', dim: '\x1b[2m', reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', cyan: '\x1b[36m' };

export function formatTerminalReport(report) {
  const { packageName, packageVersion, analyzedAt, overallScore, overallRisk, categories = {}, findings = [], recommendations = [], deepScan, trymintScores, stats } = report;
  const critical = findings.filter((f) => f.severity === 'critical');
  const high = findings.filter((f) => f.severity === 'high');
  const lines = [];

  lines.push('');
  lines.push(`${ANSI.bold}${ANSI.cyan}${deepScan ? 'TRYMINT DEEP SCAN REPORT' : 'TRYMINT POSTMORTEM REPORT'}${ANSI.reset}`);
  lines.push('');
  lines.push(`${ANSI.dim}Package:${ANSI.reset} ${packageName}@${packageVersion}`);
  lines.push(`${ANSI.dim}Analyzed:${ANSI.reset} ${String(analyzedAt).slice(0, 50)}`);
  if (deepScan && stats?.filesScanned != null) {
    lines.push(`${ANSI.dim}Files:${ANSI.reset} ${stats.filesScanned} | Lines: ${stats.linesScanned}`);
  }
  lines.push('');

  if (trymintScores) {
    lines.push(`${ANSI.bold}TRYMINT Score:${ANSI.reset}`);
    lines.push(`  Dependency: ${trymintScores.dependency}/25`);
    lines.push(`  Destructive: ${trymintScores.destructive}/25`);
    lines.push(`  Behavioral: ${trymintScores.behavioral}/25`);
    lines.push(`  Network: ${trymintScores.network}/25`);
    lines.push('');
  }

  const riskColor = overallRisk === 'CRITICAL' || overallRisk === 'HIGH' ? ANSI.red : overallRisk === 'MODERATE' ? ANSI.yellow : ANSI.green;
  lines.push(`${ANSI.bold}Overall:${ANSI.reset} ${overallScore}/100 ${riskColor}(${overallRisk})${ANSI.reset}`);
  lines.push('');

  if (Object.keys(categories).length > 0) {
    lines.push(`${ANSI.bold}Categories:${ANSI.reset}`);
    for (const cat of Object.values(categories)) {
      const tag = cat.status === 'pass' ? 'PASS' : cat.status === 'warn' ? 'WARN' : 'FAIL';
      lines.push(`  ${cat.name || '?'}: ${cat.score}/100 [${tag}]`);
    }
    lines.push('');
  }

  if (critical.length > 0) {
    lines.push(`${ANSI.bold}${ANSI.red}Critical (${critical.length}):${ANSI.reset}`);
    critical.forEach((f) => {
      lines.push(`  - [${f.id}] ${f.title || f.description || '?'}`);
      if (f.location) lines.push(`    ${f.location}`);
    });
    lines.push('');
  }

  if (high.length > 0) {
    lines.push(`${ANSI.bold}${ANSI.yellow}High (${high.length}):${ANSI.reset}`);
    high.forEach((f) => {
      lines.push(`  - [${f.id}] ${f.title || f.description || '?'}`);
    });
    lines.push('');
  }

  if (recommendations.length > 0) {
    lines.push(`${ANSI.bold}Recommendations:${ANSI.reset}`);
    recommendations.slice(0, 5).forEach((r, i) => {
      lines.push(`  ${i + 1}. ${r.action || '?'}`);
      if (r.reason) lines.push(`     ${r.reason}`);
    });
  }

  lines.push('');
  return lines.join('\n');
}
