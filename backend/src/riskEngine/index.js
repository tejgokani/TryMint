/**
 * Risk Engine - TRYMINT scoring model.
 * Formula: Total = Dependency + Destructive + Behavioral + Network (each 0-25)
 * Total: 0-100. Risk: MINIMAL (0-20), LOW (21-40), MODERATE (41-60), HIGH (61-80), CRITICAL (81-100)
 */

import { sanitizeCommand } from './utils.js';
import { getPackageScores } from './packageScoring.js';
import { analyzeFileSystem } from './fileSystem.js';
import { analyzePrivilege } from './privilege.js';
import { analyzeNetwork } from './network.js';
import { analyzePackageManager } from './packageManager.js';
import { analyzeBehavioral } from './behavioral.js';
import { analyzeSourceCode } from './sourceCode.js';

const EVALUATION_TIMEOUT_MS = 25000;

function extractMainPackage(command) {
  const m = command.match(/(?:npm\s+(?:i|install)|yarn\s+add|pnpm\s+add)\s+([^\s-][^\s]*)/i);
  if (!m) return null;
  return normalizePackageName(m[1].trim());
}

function normalizePackageName(spec) {
  if (!spec || typeof spec !== 'string') return null;
  const noVersion = spec.replace(/@\d+\.\d+.*$/, '').trim().toLowerCase();
  if (noVersion.startsWith('@')) return noVersion;
  return noVersion.split('@')[0] || null;
}

/** Convert 0-100 analyzer score to 0-25 TRYMINT component */
function toComponent25(score) {
  return Math.min(25, Math.round((score ?? 0) / 4));
}

function scoreToRiskLevel(total) {
  if (total >= 81) return 'CRITICAL';
  if (total >= 61) return 'HIGH';
  if (total >= 41) return 'MODERATE';
  if (total >= 21) return 'LOW';
  return 'MINIMAL';
}

function buildTrymintInsight(total, components, packageScores, riskLevel) {
  if (packageScores?.reason) return packageScores.reason;
  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    if (components.behavioral >= 18 && components.destructiveness < 8) {
      return 'High-risk execution behavior detected despite no destructive filesystem operations.';
    }
    return 'Multiple risk factors detected. Review before execution.';
  }
  if ((riskLevel === 'MINIMAL' || riskLevel === 'LOW') && total < 41) {
    return 'Safe to publish — no install-time execution risk detected.';
  }
  if (components.dependency >= 12 && components.behavioral < 6) {
    return 'Large dependency surface, but no risky execution intent.';
  }
  return 'Risk assessment complete.';
}

function buildEffects(fileResult, pkgResult, networkResult, isPackageInstall) {
  const effects = [];

  if (fileResult?.hasTraversal) {
    effects.push({ type: 'TRAVERSAL_ATTEMPT', target: 'detected' });
  }
  if (fileResult?.hasRecursive && fileResult?.destructivenessScore > 50) {
    effects.push({ type: 'RECURSIVE_DESTRUCTIVE', target: fileResult.fileCountEstimated });
  }
  if (pkgResult?.hasInstallScripts) {
    effects.push({ type: 'INSTALL_SCRIPTS', target: pkgResult.installScriptsList?.join(', ') || 'unknown' });
  }
  if (networkResult?.hasPipeToShell) {
    effects.push({ type: 'REMOTE_EXECUTION', target: 'pipe-to-shell' });
  }
  if (networkResult?.domains?.length > 0) {
    networkResult.domains.forEach((d) => effects.push({ type: 'NETWORK_REQUEST', target: d }));
  }
  if (isPackageInstall) {
    effects.push({ type: 'FILE_MODIFY', target: 'package.json' });
    effects.push({ type: 'FILE_CREATE', target: 'node_modules' });
    effects.push({ type: 'FILE_CREATE', target: 'package-lock.json' });
  }

  return effects;
}

function buildWarnings(triggers, fileResult, pkgResult, networkResult) {
  const warnings = [...(triggers || [])];

  if (fileResult?.hasTraversal) {
    warnings.push('Directory traversal attempt detected');
  }
  if (fileResult?.hasRecursive && fileResult?.destructivenessScore > 40) {
    warnings.push('Recursive operation on filesystem');
  }
  if (networkResult?.hasPipeToShell) {
    warnings.push('Command pipes remote content to shell - never run untrusted scripts');
  }
  if (networkResult?.hasHttp) {
    warnings.push('Untrusted protocol: HTTP (no encryption)');
  }
  if (pkgResult?.hasInstallScripts) {
    warnings.push('Package has install scripts that run during installation');
  }
  if (pkgResult?.recentlyPublished) {
    warnings.push('Recently published package - less community vetting');
  }

  return [...new Set(warnings)];
}

/**
 * Evaluate command risk. No execution. No filesystem access.
 * @param {string} command - Raw command string
 * @param {string} workingDir - Working directory context
 * @param {{ packageHint?: string }} [options] - Optional: packageHint for reliable package extraction (e.g. from scan)
 * @returns {Promise<Object>} Full evaluation result
 */
export async function evaluate(command, workingDir, options = {}) {
  const packageHint = options?.packageHint;
  const analysisSteps = [];
  const allTriggers = [];

  const sanitized = sanitizeCommand(command);
  if (!sanitized.valid) {
    return {
      success: false,
      error: sanitized.error,
      finalScore: 10,
      totalScore: 100,
      riskLevel: 'HIGH',
      canExecute: false,
      analysisSteps: [{ check: 'Input validation', data: {}, result: sanitized.error }],
    };
  }

  const cmd = sanitized.sanitized;

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Evaluation timeout')), EVALUATION_TIMEOUT_MS);
  });

  const evalPromise = (async () => {
    const [fileResult, privilegeResult, networkResult, behavioralResult] = await Promise.all([
      Promise.resolve(analyzeFileSystem(cmd, workingDir)),
      Promise.resolve(analyzePrivilege(cmd, workingDir)),
      Promise.resolve(analyzeNetwork(cmd)),
      Promise.resolve(analyzeBehavioral(cmd)),
    ]);

    const pkgResult = await analyzePackageManager(cmd);
    const isPackageInstall =
      pkgResult?.dependencyRisk > 0 ||
      cmd.toLowerCase().includes('npm install') ||
      cmd.toLowerCase().includes('yarn add');
    const mainPkg = packageHint ? normalizePackageName(packageHint) : extractMainPackage(cmd);

    let sourceCodeResult = { sourceCodeScore: 0, sourceCodeFindings: [], triggers: [], steps: [] };
    if (isPackageInstall) {
      sourceCodeResult = await analyzeSourceCode(cmd, mainPkg);
    }

    allTriggers.push(
      ...(fileResult?.triggers || []),
      ...(privilegeResult?.triggers || []),
      ...(networkResult?.triggers || []),
      ...(pkgResult?.triggers || []),
      ...(behavioralResult?.triggers || []),
      ...(sourceCodeResult?.triggers || [])
    );

    analysisSteps.push(
      { section: 'File system', steps: fileResult?.steps || [] },
      { section: 'Privilege', steps: privilegeResult?.steps || [] },
      { section: 'Network', steps: networkResult?.steps || [] },
      { section: 'Package', steps: pkgResult?.steps || [] },
      { section: 'Behavioral', steps: behavioralResult?.steps || [] },
      { section: 'Source code', steps: sourceCodeResult?.steps || [] }
    );

    let dependency25, destructiveness25, behavioral25, network25;

    const packageScores = mainPkg ? getPackageScores(mainPkg, {
      dependency: pkgResult?.dependencyRisk,
      behavioral: behavioralResult?.behavioralScore,
      network: networkResult?.networkScore,
    }) : null;

    if (packageScores) {
      dependency25 = packageScores.dependency;
      destructiveness25 = packageScores.destructiveness;
      behavioral25 = packageScores.behavioral;
      network25 = packageScores.network;
    } else {
      let destructiveness = fileResult?.destructivenessScore ?? 0;
      let dependencyRisk = pkgResult?.dependencyRisk ?? 0;
      let networkRisk = networkResult?.networkScore ?? 0;
      let behavioralRisk = behavioralResult?.behavioralScore ?? 0;

      const sourceCodeScore = sourceCodeResult?.sourceCodeScore ?? 0;
      if (sourceCodeScore > 0) {
        behavioralRisk = Math.max(behavioralRisk, sourceCodeScore);
      }

      if (isPackageInstall) {
        if (destructiveness === 0) {
          destructiveness = 0;
        }
        if (networkRisk === 0 && !networkResult?.hasPipeToShell) {
          networkRisk = 15;
        }
        if (pkgResult?.hasInstallScripts && behavioralRisk < 60) {
          behavioralRisk = Math.max(behavioralRisk, 55);
        }
      }

      dependency25 = toComponent25(dependencyRisk);
      destructiveness25 = toComponent25(destructiveness);
      behavioral25 = toComponent25(behavioralRisk);
      network25 = toComponent25(networkRisk);
    }

    const totalScore = Math.min(100, dependency25 + destructiveness25 + behavioral25 + network25);
    const riskLevel = scoreToRiskLevel(totalScore);
    const finalScore = Math.min(10, Math.round(totalScore / 10));
    const trymintInsight = buildTrymintInsight(
      totalScore,
      { dependency: dependency25, destructiveness: destructiveness25, behavioral: behavioral25, network: network25 },
      packageScores,
      riskLevel
    );

    analysisSteps.push({
      section: 'Final score',
      steps: [
        {
          check: 'TRYMINT Formula: Total = Dependency + Destructive + Behavioral + Network (each 0-25)',
          data: {
            Dependency: dependency25,
            Destructive: destructiveness25,
            Behavioral: behavioral25,
            Network: network25,
          },
          result: `Total: ${totalScore}/100 (${riskLevel}) — ${trymintInsight}`,
        },
      ],
    });

    const effects = buildEffects(fileResult, pkgResult, networkResult, isPackageInstall);
    const warnings = buildWarnings(allTriggers, fileResult, pkgResult, networkResult);

    return {
      success: true,
      finalScore,
      totalScore,
      riskLevel,
      dependencyRisk: dependency25,
      destructiveness: destructiveness25,
      behavioralRisk: behavioral25,
      networkRisk: network25,
      privilege: privilegeResult?.privilegeScore ?? 0,
      trymintInsight,
      sourceCodeFindings: sourceCodeResult?.sourceCodeFindings ?? [],
      triggers: [...new Set(allTriggers)],
      analysisSteps,
      effects,
      warnings,
      canExecute: riskLevel !== 'HIGH' && riskLevel !== 'CRITICAL',
    };
  })();

  try {
    return await Promise.race([evalPromise, timeoutPromise]);
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Evaluation failed',
      finalScore: 10,
      totalScore: 100,
      riskLevel: 'HIGH',
      canExecute: false,
      analysisSteps: [{ check: 'Evaluation', data: {}, result: err.message }],
    };
  }
}
