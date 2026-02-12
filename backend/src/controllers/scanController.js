/**
 * Package Scan Controller
 * Public endpoint for scanning npm packages without session.
 * Reuses risk engine for analysis - no execution, no agent.
 */

import { evaluate } from '../riskEngine/index.js';
import { generatePackageInsight } from '../services/openaiService.js';
import { ValidationError } from '../utils/errors.js';

// Allow: express, lodash@4.17, @scope/pkg, @scope/pkg@1.0
// No shell metacharacters
const SAFE_SPEC_REGEX = /^[@a-z0-9-_.\/~]+$/i;

/**
 * Sanitize and validate package input
 */
function parsePackageInput(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    throw new ValidationError('Package name or spec is required');
  }
  if (trimmed.length > 256) {
    throw new ValidationError('Package spec too long');
  }
  if (!SAFE_SPEC_REGEX.test(trimmed)) {
    throw new ValidationError('Invalid package name format');
  }
  return trimmed;
}

/**
 * POST /scan/package - Scan an npm package (no auth required)
 * Body: { package: "express", aiSummary?: boolean }
 * When aiSummary=true and OPENAI_API_KEY is set, enriches trymintInsight with AI-generated summary.
 */
export async function scanPackage(req, res, next) {
  try {
    const { package: pkgInput, aiSummary: wantAiSummary } = req.body || {};

    const pkgSpec = parsePackageInput(pkgInput);
    const command = `npm install ${pkgSpec}`;
    const workingDir = '/';

    const evaluation = await evaluate(command, workingDir, { packageHint: pkgSpec });

    let trymintInsight = evaluation.trymintInsight ?? '';
    let aiSummaryUsed = false;
    let aiSummaryError = null;

    if (wantAiSummary) {
      const { summary, error } = await generatePackageInsight({
        package: pkgSpec,
        totalScore: evaluation.totalScore ?? 0,
        riskLevel: evaluation.riskLevel ?? 'UNKNOWN',
        components: {
          dependency: evaluation.dependencyRisk,
          destructiveness: evaluation.destructiveness,
          behavioral: evaluation.behavioralRisk,
          network: evaluation.networkRisk,
        },
      });
      if (summary) {
        trymintInsight = summary;
        aiSummaryUsed = true;
      } else {
        aiSummaryError = error ?? 'OpenAI API call failed';
      }
    }

    res.json({
      success: true,
      data: {
        package: pkgSpec,
        command,
        scannedAt: new Date().toISOString(),
        finalScore: evaluation.finalScore ?? 0,
        totalScore: evaluation.totalScore ?? 0,
        riskLevel: evaluation.riskLevel ?? 'UNKNOWN',
        destructiveness: evaluation.destructiveness ?? 0,
        privilege: evaluation.privilege ?? 0,
        dependencyRisk: evaluation.dependencyRisk ?? 0,
        networkRisk: evaluation.networkRisk ?? 0,
        behavioralRisk: evaluation.behavioralRisk ?? 0,
        trymintInsight,
        triggers: evaluation.triggers ?? [],
        analysisSteps: evaluation.analysisSteps ?? [],
        effects: evaluation.effects ?? [],
        warnings: evaluation.warnings ?? [],
        sourceCodeFindings: evaluation.sourceCodeFindings ?? [],
        canExecute: evaluation.canExecute ?? false,
        aiSummaryUsed: wantAiSummary ? aiSummaryUsed : undefined,
        aiSummaryError: wantAiSummary && !aiSummaryUsed ? aiSummaryError : undefined,
      },
    });
  } catch (err) {
    next(err);
  }
}
