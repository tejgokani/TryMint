/**
 * Postmortem Controller - Run deep security analysis.
 */

import { analyzePostmortem } from '../services/postmortemService.js';

/**
 * POST /postmortem - Analyze package (packageJson + optional files)
 * Body: { packageJson: object, files?: Record<string, string>, packagePath?: string }
 */
export async function runPostmortem(req, res, next) {
  try {
    const { packageJson, files = {}, packagePath = '/', deepScan = true } = req.body || {};

    if (!packageJson || typeof packageJson !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'packageJson is required',
      });
    }

    const report = await analyzePostmortem({
      packageJson,
      files,
      packagePath,
      deepScan: !!deepScan,
      onProgress: (stage, percent) => {
        // Could stream progress via SSE; for now just run
      },
    });

    res.json({
      success: true,
      data: report,
    });
  } catch (err) {
    next(err);
  }
}
