/**
 * Privilege Risk Analyzer
 * Detects sudo, su, chmod, chown, and execution outside allowed scope.
 */

const PRIVILEGE_PATTERNS = [
  { pattern: /\bsudo\s+/gi, score: 85, name: 'sudo invocation' },
  { pattern: /\bsu\s+-/gi, score: 90, name: 'su with flags' },
  { pattern: /\bsu\s+\w/gi, score: 80, name: 'su user switch' },
  { pattern: /\bchown\s+/gi, score: 75, name: 'chown - change ownership' },
  { pattern: /\bchmod\s+/gi, score: 65, name: 'chmod - change permissions' },
  { pattern: /\bchgrp\s+/gi, score: 70, name: 'chgrp - change group' },
  { pattern: /\bapt\s+install|\bapt-get\s+install/gi, score: 70, name: 'apt install (requires root)' },
  { pattern: /\byum\s+install|\bdnf\s+install/gi, score: 70, name: 'yum/dnf install' },
  { pattern: /\bbrew\s+install/gi, score: 50, name: 'brew install' },
  { pattern: /\bpacman\s+-S/gi, score: 70, name: 'pacman install' },
];

export function analyzePrivilege(command, workingDir) {
  const steps = [];
  const triggers = [];
  let privilegeScore = 0;

  for (const { pattern, score, name } of PRIVILEGE_PATTERNS) {
    if (pattern.test(command)) {
      privilegeScore = Math.max(privilegeScore, score);
      triggers.push(`Privilege: ${name}`);
    }
  }

  steps.push({
    check: 'Privilege pattern detection',
    data: { privilegeScore, triggers: triggers.length },
    result: privilegeScore > 0 ? `Privilege escalation risk: ${privilegeScore}` : 'No privilege patterns detected',
  });

  // Execution outside scope - absolute path to system binaries
  const systemPaths = ['/usr/bin/', '/bin/', '/sbin/', '/usr/sbin/'];
  for (const sysPath of systemPaths) {
    if (command.includes(sysPath)) {
      triggers.push('References system binary path');
      privilegeScore = Math.min(100, privilegeScore + 10);
      break;
    }
  }

  return {
    privilegeScore: Math.min(100, privilegeScore),
    triggers,
    steps,
  };
}
