/**
 * Deep Scan - Full repository analysis, every line parsed.
 * Uses TRYMINT formula: Total = Dependency + Destructive + Behavioral + Network (each 0-25)
 * No time or size limits — thorough calculation.
 */

import { createGunzip } from 'zlib';
import * as tar from 'tar-stream';
import { Readable } from 'stream';

const NPM_REGISTRY = 'https://registry.npmjs.org';
const FETCH_TIMEOUT_MS = 60000; // 60s for tarball
const HTTP_CLIENT_PACKAGES = new Set(['axios', 'node-fetch', 'got', 'request', 'superagent', 'ky', 'undici']);

// Patterns mapped to TRYMINT components. Each: { pattern, component, severity 1-10, name }
// Severity contributes to component score: higher = more risk per occurrence
const DESTRUCTIVE_PATTERNS = [
  { pattern: /\bfs\.(unlink|unlinkSync|rm|rmSync|rmdir|rmdirSync)\s*\(/i, severity: 10, name: 'File deletion' },
  { pattern: /\bfs\.(truncate|truncateSync)\s*\(/i, severity: 8, name: 'File truncation' },
  { pattern: /\bfs\.(writeFile|writeFileSync|appendFile|appendFileSync)\s*\(/i, severity: 4, name: 'File write' },
  { pattern: /\brm\s+-rf|\brm\s+-r\s+-f|\brmdir\s+/i, severity: 10, name: 'Shell delete' },
  { pattern: /\bchild_process\.(exec|execSync|spawn)\s*\([^)]*rm\s+/i, severity: 9, name: 'Exec with rm' },
  { pattern: /\bmkfs\.|format\s+(fs|disk|drive)\b/i, severity: 10, name: 'Disk format' },
  { pattern: /\bdd\s+if=/i, severity: 10, name: 'Raw disk write' },
  { pattern: /\bchmod\s+-R|\bchown\s+-R/i, severity: 7, name: 'Recursive permission change' },
];

const BEHAVIORAL_PATTERNS = [
  { pattern: /\beval\s*\(/i, severity: 10, name: 'eval() usage' },
  { pattern: /\bnew\s+Function\s*\(/i, severity: 10, name: 'Function constructor' },
  { pattern: /\bvm\.(runInContext|runInNewContext|runInThisContext)\s*\(/i, severity: 10, name: 'vm execution' },
  { pattern: /\bchild_process\.(exec|execSync|spawn)\s*\(/i, severity: 9, name: 'Shell execution' },
  { pattern: /\brequire\s*\(\s*[^'"\s][^)]*\)/, severity: 6, name: 'Dynamic require' },
  { pattern: /\bprocess\.(exit|kill)\s*\(/i, severity: 5, name: 'Process control' },
  { pattern: /Buffer\.from\s*\([^)]+,\s*['"]base64['"]\s*\)[^;]*\|\s*(bash|sh)/i, severity: 10, name: 'Base64 to shell' },
  { pattern: /\$\s*\(\s*(curl|wget)\s+/i, severity: 9, name: 'Command substitution download' },
  { pattern: /\.env\b|process\.env\.(AWS|SECRET|KEY|TOKEN|PASSWORD|SSH)/i, severity: 7, name: 'Sensitive env' },
  { pattern: /~\/\.(ssh|aws|gnupg)|id_rsa|id_ed25519|\.env\b/i, severity: 9, name: 'Credential path' },
];

const NETWORK_PATTERNS = [
  { pattern: /(?:\bfetch\s*\(|\bhttps?\.request\s*\(|\bhttp\.request\s*\(|\bhttps\.request\s*\()/i, severity: 5, name: 'HTTP request' },
  { pattern: /\bnet\.(connect|createConnection)\s*\(/i, severity: 6, name: 'Raw TCP' },
  { pattern: /\bdgram\.(createSocket|createSocket)\s*\(/i, severity: 5, name: 'UDP socket' },
  { pattern: /https?:\/\/[^\s'"<>|]+/i, severity: 3, name: 'URL in code' },
  { pattern: /\bsocket\.(connect|emit)\s*\(/i, severity: 5, name: 'Socket usage' },
];

function scanLineByLine(content, filePath, packageName, component) {
  const findings = [];
  const lines = content.split(/\r?\n/);
  const pkgLower = (packageName || '').toLowerCase();
  const patterns = component === 'destructive' ? DESTRUCTIVE_PATTERNS
    : component === 'behavioral' ? BEHAVIORAL_PATTERNS
    : component === 'network' ? NETWORK_PATTERNS : [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const p of patterns) {
      if (p.pattern.test(line)) {
        if (component === 'network' && p.name === 'HTTP request' && HTTP_CLIENT_PACKAGES.has(pkgLower)) continue;
        findings.push({
          component,
          name: p.name,
          severity: p.severity,
          line: i + 1,
          file: filePath,
          snippet: line.trim().slice(0, 100),
        });
      }
    }
  }
  return findings;
}

/** Convert raw severity sum to 0-25 component score. Severity 10 = critical, scales down. */
function severityToComponent25(findings) {
  if (findings.length === 0) return 0;
  const totalSeverity = findings.reduce((a, f) => a + (f.severity || 0), 0);
  return Math.min(25, Math.round(totalSeverity / 2));
}

async function fetchMetadata(packageName) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(`${NPM_REGISTRY}/${encodeURIComponent(packageName)}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

async function fetchTarball(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok || !res.body) return null;
    return res.body;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

/**
 * Deep scan a package - fetch full tarball, parse every line of every JS/TS file.
 * @param {Object} opts
 * @param {string} opts.packageName - e.g. 'express', 'lodash'
 * @param {string} [opts.version] - specific version or 'latest'
 * @param {function} [opts.onProgress] - (stage, percent, detail) => void
 * @returns {Promise<Object>} { dependency25, destructive25, behavioral25, network25, totalScore, riskLevel, findings, stats }
 */
export async function runDeepScan({ packageName, version, onProgress }) {
  const report = (stage, percent, detail) => onProgress?.(stage, percent, detail);

  report('fetching-metadata', 5, packageName);
  const metadata = await fetchMetadata(packageName);
  if (!metadata) {
    return {
      error: 'Failed to fetch package metadata from registry',
      dependency25: 25,
      destructive25: 0,
      behavioral25: 0,
      network25: 0,
      totalScore: 25,
      riskLevel: 'MODERATE',
      findings: [],
      stats: { filesScanned: 0, linesScanned: 0 },
    };
  }

  const ver = version || metadata['dist-tags']?.latest;
  const versionData = metadata.versions?.[ver] || Object.values(metadata.versions || {})[0];
  const tarballUrl = versionData?.dist?.tarball;

  if (!tarballUrl) {
    return {
      error: 'No tarball URL for package',
      dependency25: 0,
      destructive25: 0,
      behavioral25: 0,
      network25: 0,
      totalScore: 0,
      riskLevel: 'UNKNOWN',
      findings: [],
      stats: { filesScanned: 0, linesScanned: 0 },
    };
  }

  report('fetching-tarball', 15, tarballUrl);
  const tarballStream = await fetchTarball(tarballUrl);
  if (!tarballStream) {
    return {
      error: 'Failed to fetch package tarball',
      dependency25: 25,
      destructive25: 0,
      behavioral25: 0,
      network25: 0,
      totalScore: 25,
      riskLevel: 'MODERATE',
      findings: [],
      stats: { filesScanned: 0, linesScanned: 0 },
    };
  }

  // Dependency risk from package metadata
  let dependency25 = 0;
  const scripts = versionData?.scripts || {};
  const installScripts = ['preinstall', 'install', 'postinstall', 'prepublish', 'prepare'];
  const hasInstallScripts = installScripts.some((s) => scripts[s]);
  const depCount = Object.keys(versionData?.dependencies || {}).length;
  if (hasInstallScripts) dependency25 += 15;
  if (depCount > 50) dependency25 += 10;
  else if (depCount > 20) dependency25 += 5;
  else if (depCount > 5) dependency25 += 2;
  dependency25 = Math.min(25, dependency25);

  const destructiveFindings = [];
  const behavioralFindings = [];
  const networkFindings = [];
  let filesScanned = 0;
  let linesScanned = 0;

  const extractStream = tar.extract();
  const gunzip = createGunzip();

  const parsePromise = new Promise((resolve, reject) => {
    let totalFiles = 0;

    extractStream.on('entry', (header, stream, next) => {
      const name = header.name || '';
      const isCode = /\.(js|mjs|cjs|ts|tsx|jsx)$/i.test(name) && !name.includes('node_modules');

      if (isCode) {
        totalFiles++;
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => {
          const buf = Buffer.concat(chunks);
          const content = buf.toString('utf8', 0, buf.length);
          const lines = content.split(/\r?\n/);
          linesScanned += lines.length;

          const dest = scanLineByLine(content, name.split('/').pop(), packageName, 'destructive');
          const beh = scanLineByLine(content, name.split('/').pop(), packageName, 'behavioral');
          const net = scanLineByLine(content, name.split('/').pop(), packageName, 'network');

          destructiveFindings.push(...dest);
          behavioralFindings.push(...beh);
          networkFindings.push(...net);

          filesScanned++;
          if (totalFiles % 10 === 0) {
            report('scanning', 15 + Math.min(60, (totalFiles / 100) * 60), `${filesScanned} files, ${linesScanned} lines`);
          }
          next();
        });
        stream.on('error', () => { stream.resume(); next(); });
      } else {
        stream.resume();
        stream.on('end', next);
      }
    });

    extractStream.on('finish', () => resolve());
    extractStream.on('error', reject);
  });

  try {
    const readStream = Readable.fromWeb(tarballStream);
    readStream.pipe(gunzip).pipe(extractStream);
    await parsePromise;
  } catch (err) {
    return {
      error: err.message || 'Tarball extraction failed',
      dependency25,
      destructive25: 0,
      behavioral25: 0,
      network25: 0,
      totalScore: dependency25,
      riskLevel: dependency25 >= 21 ? 'LOW' : 'MODERATE',
      findings: [],
      stats: { filesScanned, linesScanned },
    };
  }

  report('calculating', 90, 'TRYMINT formula');

  const destructive25 = severityToComponent25(destructiveFindings);
  const behavioral25 = severityToComponent25(behavioralFindings);
  const network25 = severityToComponent25(networkFindings);

  const totalScore = Math.min(100, dependency25 + destructive25 + behavioral25 + network25);
  let riskLevel = 'MINIMAL';
  if (totalScore >= 81) riskLevel = 'CRITICAL';
  else if (totalScore >= 61) riskLevel = 'HIGH';
  else if (totalScore >= 41) riskLevel = 'MODERATE';
  else if (totalScore >= 21) riskLevel = 'LOW';

  const allFindings = [
    ...destructiveFindings.map((f) => ({ ...f, severity: f.severity >= 8 ? 'critical' : f.severity >= 5 ? 'high' : 'medium' })),
    ...behavioralFindings.map((f) => ({ ...f, severity: f.severity >= 8 ? 'critical' : f.severity >= 5 ? 'high' : 'medium' })),
    ...networkFindings.map((f) => ({ ...f, severity: f.severity >= 5 ? 'high' : 'medium' })),
  ].sort((a, b) => (b.severity || 0) - (a.severity || 0));

  report('complete', 100);

  return {
    packageName,
    version: ver,
    dependency25,
    destructive25,
    behavioral25,
    network25,
    totalScore,
    riskLevel,
    findings: allFindings,
    stats: { filesScanned, linesScanned },
  };
}
