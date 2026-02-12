/**
 * Network Risk Analyzer
 * Extract domains, detect pipe-to-shell, estimate download size, flag http vs https.
 */

const URL_REGEX = /(https?:\/\/[^\s'"<>|]+)/gi;
const PIPE_TO_SHELL = /\|\s*(bash|sh|zsh|dash|ksh|csh|tcsh)\b/gi;
const PIPE_FROM_CURL = /curl\s+[^|]+\|\s*(bash|sh)/gi;
const PIPE_FROM_WGET = /wget\s+[^|]+\|\s*(bash|sh)/gi;

export function analyzeNetwork(command) {
  const steps = [];
  const triggers = [];
  let networkScore = 0;
  const domains = new Set();
  let hasHttp = false;
  let hasHttps = false;
  let hasPipeToShell = false;
  let estimatedDownloadSize = 'unknown';

  // Step 1: Extract URLs
  const urlMatches = command.match(URL_REGEX) || [];
  for (const url of urlMatches) {
    try {
      const parsed = new URL(url);
      domains.add(parsed.hostname);
      if (parsed.protocol === 'http:') hasHttp = true;
      if (parsed.protocol === 'https:') hasHttps = true;
    } catch {
      domains.add(url);
    }
  }

  steps.push({
    check: 'URL extraction',
    data: { domains: [...domains], count: domains.size },
    result: `Found ${domains.size} domain(s)`,
  });

  // Step 2: Pipe to shell
  if (PIPE_TO_SHELL.test(command)) {
    hasPipeToShell = true;
    networkScore = Math.max(networkScore, 90);
    triggers.push('Remote execution: pipe to shell (curl|bash, wget|sh)');
  }
  if (PIPE_FROM_CURL.test(command) || PIPE_FROM_WGET.test(command)) {
    hasPipeToShell = true;
    networkScore = Math.max(networkScore, 95);
    triggers.push('Download and execute: fetches remote script and pipes to shell');
  }

  steps.push({
    check: 'Remote execution pattern',
    data: { hasPipeToShell },
    result: hasPipeToShell ? 'Pipe-to-shell detected - high risk' : 'No pipe-to-shell',
  });

  // Step 3: HTTP vs HTTPS
  if (hasHttp && !hasHttps) {
    networkScore = Math.max(networkScore, 60);
    triggers.push('Untrusted protocol: HTTP (no TLS)');
  }
  if (hasHttp && hasHttps) {
    triggers.push('Mixed protocols: HTTP and HTTPS');
  }

  steps.push({
    check: 'Protocol analysis',
    data: { hasHttp, hasHttps },
    result: hasHttp ? 'HTTP detected - unencrypted' : 'HTTPS or no URLs',
  });

  // Step 4: Download size - cannot determine without fetch. Mark unknown.
  steps.push({
    check: 'Download size estimate',
    data: { estimatedDownloadSize },
    result: 'Size unknown without fetching (not performed)',
  });

  // Base score for network commands
  if (domains.size > 0 && networkScore === 0) {
    networkScore = 40;
    triggers.push('Network request to external domain');
  }

  return {
    networkScore: Math.min(100, networkScore),
    domains: [...domains],
    hasHttp,
    hasHttps,
    hasPipeToShell,
    estimatedDownloadSize,
    triggers,
    steps,
  };
}
