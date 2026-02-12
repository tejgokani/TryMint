/**
 * Behavioral Risk Analyzer
 * Detects unusual patterns, fork bombs, obfuscation attempts.
 */

const BEHAVIORAL_PATTERNS = [
  { pattern: /:\(\)\{.*\|\:&\s*\};:/, score: 100, name: 'Fork bomb pattern' },
  { pattern: /\beval\s*\(/, score: 90, name: 'eval() usage' },
  { pattern: /\b(base64|b64)\s+-d.*\|\s*(bash|sh)/gi, score: 95, name: 'Base64 decode to shell' },
  { pattern: /\$\s*\(\s*curl\s+/gi, score: 85, name: 'Command substitution with curl' },
  { pattern: /\bpython\s+-c\s+['"]/gi, score: 70, name: 'Python inline execution' },
  { pattern: /\bnode\s+-e\s+['"]/gi, score: 70, name: 'Node inline execution' },
  { pattern: /\bperl\s+-e\s+['"]/gi, score: 70, name: 'Perl inline execution' },
  { pattern: /\bruby\s+-e\s+['"]/gi, score: 70, name: 'Ruby inline execution' },
  { pattern: /\bshutdown\b|\breboot\b/gi, score: 95, name: 'System shutdown/reboot' },
];

export function analyzeBehavioral(command) {
  const steps = [];
  const triggers = [];
  let behavioralScore = 0;

  for (const { pattern, score, name } of BEHAVIORAL_PATTERNS) {
    if (pattern.test(command)) {
      behavioralScore = Math.max(behavioralScore, score);
      triggers.push(`Behavioral: ${name}`);
    }
  }

  steps.push({
    check: 'Behavioral pattern detection',
    data: { behavioralScore, triggers: triggers.length },
    result: behavioralScore > 0 ? `Suspicious pattern: ${behavioralScore}` : 'No suspicious patterns',
  });

  return {
    behavioralScore: Math.min(100, behavioralScore),
    triggers,
    steps,
  };
}
