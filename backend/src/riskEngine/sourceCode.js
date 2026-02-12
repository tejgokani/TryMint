/**
 * Source Code Analyzer
 * Fetches package tarball, extracts JS files, scans for suspicious patterns.
 * Main package only (no transitive deps) to keep scan fast.
 */

import { createGunzip } from 'zlib';
import * as tar from 'tar-stream';
import { Readable } from 'stream';

const NPM_REGISTRY = 'https://registry.npmjs.org';
const FETCH_TIMEOUT_MS = 10000;
const MAX_FILE_SIZE = 500 * 1024; // 500KB per file
const MAX_FILES = 50;
const MAX_TOTAL_BYTES = 2 * 1024 * 1024; // 2MB total

// Suspicious patterns: { pattern, score, name, skipForPackages }
// skipForPackages: packages where this pattern is expected (e.g. HTTP clients have fetch)
const HTTP_CLIENT_PACKAGES = new Set(['axios', 'node-fetch', 'got', 'request', 'superagent', 'ky', 'undici']);

const SOURCE_PATTERNS = [
  { pattern: /\beval\s*\(/, score: 90, name: 'eval() usage' },
  { pattern: /\bnew\s+Function\s*\(/, score: 85, name: 'Function constructor' },
  { pattern: /\bvm\.runInContext\b|\bvm\.runInNewContext\b/, score: 90, name: 'vm execution' },
  { pattern: /\bchild_process\.(exec|execSync|spawn)\s*\(/, score: 80, name: 'child_process execution' },
  { pattern: /\brequire\s*\(\s*[^'"\s][^)]*\)/, score: 50, name: 'Dynamic require' },
  { pattern: /\.env|process\.env\.(AWS|HOME|USER|SSH|SECRET|KEY|TOKEN|PASSWORD)/i, score: 75, name: 'Sensitive env access' },
  { pattern: /~\/\.(ssh|aws|gnupg|config)|\.env\b|id_rsa|id_ed25519/i, score: 90, name: 'Credential path access' },
  { pattern: /Buffer\.from\s*\([^)]+,\s*['"]base64['"]\s*\)[^;]*\|\s*(bash|sh)/i, score: 95, name: 'Base64 decode to shell' },
  { pattern: /\$\s*\(\s*(curl|wget)\s+/i, score: 85, name: 'Command substitution with download' },
  { pattern: /(?:\bfetch\s*\(|\bhttps?\.request\s*\()\s*[^)]*\)/g, score: 40, name: 'Network request', skipForPackages: HTTP_CLIENT_PACKAGES },
  { pattern: /fs\.(readFile|writeFile|appendFile|unlink)\s*\(/i, score: 45, name: 'File system access' },
  { pattern: /process\.exit\s*\(|process\.kill\s*\(/, score: 50, name: 'Process control' },
];

function extractPackageNames(command) {
  const lowered = command.toLowerCase();
  const packages = [];
  if (lowered.startsWith('npm install') || lowered.startsWith('npm i ')) {
    const rest = command.replace(/^npm\s+(?:i|install)\s+/, '').trim();
    const tokens = rest.split(/\s+/);
    for (const t of tokens) {
      if (t.startsWith('-') || t.startsWith('--')) break;
      if (t) packages.push(t);
    }
  } else if (lowered.startsWith('yarn add ') || lowered.startsWith('pnpm add ') || lowered.startsWith('pnpm i ')) {
    const rest = command.replace(/^(?:yarn|pnpm)\s+(?:add|i)\s+/, '').trim();
    const tokens = rest.split(/\s+/);
    for (const t of tokens) {
      if (t.startsWith('-') || t.startsWith('--')) break;
      if (t) packages.push(t);
    }
  }
  return [...new Set(packages)].filter(Boolean);
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

function scanContent(content, packageName = '') {
  const findings = [];
  const text = content.toString('utf8', 0, Math.min(content.length, 100000));
  const pkgLower = (packageName || '').toLowerCase();
  for (const p of SOURCE_PATTERNS) {
    if (p.skipForPackages && pkgLower && p.skipForPackages.has(pkgLower)) continue;
    const match = text.match(p.pattern);
    if (match) {
      findings.push({ score: p.score, name: p.name, snippet: match[0].slice(0, 80) });
    }
  }
  return findings;
}

export async function analyzeSourceCode(command, packageNameHint = '') {
  const steps = [];
  const triggers = [];
  let sourceCodeScore = 0;
  const findings = [];

  const lowered = command.toLowerCase();
  const isPackageCommand =
    lowered.startsWith('npm install') ||
    lowered.startsWith('npm i ') ||
    lowered.startsWith('yarn add ') ||
    lowered.startsWith('pnpm add ') ||
    lowered.startsWith('pnpm i ');

  if (!isPackageCommand) {
    steps.push({ check: 'Source code', data: {}, result: 'Not a package install command' });
    return {
      sourceCodeScore: 0,
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }

  const packages = extractPackageNames(command);
  if (packages.length === 0) {
    steps.push({ check: 'Source code', data: {}, result: 'No package specified' });
    return {
      sourceCodeScore: 0,
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }

  // Analyze first package only (main package)
  const pkgName = packages[0];
  const pkgBase = (pkgName || '').replace(/@\d+\.\d+.*$/, '').toLowerCase().split('@')[0];
  const effectivePkg = packageNameHint || pkgBase;
  const metadata = await fetchMetadata(pkgName);
  if (!metadata) {
    triggers.push(`Source code: ${pkgName} - metadata fetch failed`);
    sourceCodeScore = 50;
    steps.push({ check: `Fetch metadata ${pkgName}`, data: {}, result: 'Registry fetch failed' });
    return {
      sourceCodeScore: Math.min(100, sourceCodeScore),
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }

  const latestVer = metadata['dist-tags']?.latest;
  const versionData = metadata.versions?.[latestVer];
  const tarballUrl = versionData?.dist?.tarball;

  if (!tarballUrl) {
    steps.push({ check: `Tarball ${pkgName}`, data: {}, result: 'No tarball URL' });
    return {
      sourceCodeScore: 0,
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }

  steps.push({ check: `Fetch tarball ${pkgName}@${latestVer}`, data: { url: tarballUrl }, result: 'Downloading...' });

  const tarballStream = await fetchTarball(tarballUrl);
  if (!tarballStream) {
    triggers.push(`Source code: ${pkgName} - tarball fetch failed`);
    sourceCodeScore = 50;
    steps.push({ check: 'Tarball download', data: {}, result: 'Failed' });
    return {
      sourceCodeScore: Math.min(100, sourceCodeScore),
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }

  const extractStream = tar.extract();
  const gunzip = createGunzip();

  const parsePromise = new Promise((resolve, reject) => {
    let fileCount = 0;
    let totalBytes = 0;
    const allFindings = [];

    extractStream.on('entry', (header, stream, next) => {
      const name = header.name || '';
      const isJs = /\.(js|mjs|cjs)$/i.test(name) && !name.includes('node_modules');
      const inPackage = name.split('/').length <= 3; // package/version/file

      const drain = () => {
        stream.resume();
        stream.on('end', next);
      };

      if (isJs && inPackage && fileCount < MAX_FILES && totalBytes < MAX_TOTAL_BYTES) {
        const chunks = [];
        stream.on('data', (chunk) => {
          if (chunks.reduce((a, c) => a + c.length, 0) + chunk.length <= MAX_FILE_SIZE) {
            chunks.push(chunk);
          }
        });
        stream.on('end', () => {
          const buf = Buffer.concat(chunks);
          totalBytes += buf.length;
          fileCount += 1;
          const fileFindings = scanContent(buf, effectivePkg);
          fileFindings.forEach((f) => {
            allFindings.push({ file: name.split('/').pop(), ...f });
            sourceCodeScore = Math.max(sourceCodeScore, f.score);
            triggers.push(`Source: ${f.name} in ${name.split('/').pop()}`);
          });
          next();
        });
        stream.on('error', () => { stream.resume(); next(); });
      } else {
        drain();
      }
    });

    extractStream.on('finish', () => {
      steps.push({
        check: 'Source scan',
        data: { filesScanned: fileCount, findings: allFindings.length },
        result: allFindings.length > 0 ? `Found ${allFindings.length} suspicious pattern(s)` : 'No suspicious patterns',
      });
      resolve({ sourceCodeScore, findings: allFindings });
    });

    extractStream.on('error', reject);
  });

  try {
    const readStream = Readable.fromWeb(tarballStream);
    readStream.pipe(gunzip).pipe(extractStream);

    const { sourceCodeScore: score, findings: f } = await parsePromise;

    return {
      sourceCodeScore: Math.min(100, score),
      sourceCodeFindings: f,
      triggers,
      steps,
    };
  } catch (err) {
    triggers.push(`Source code: ${pkgName} - extraction failed`);
    sourceCodeScore = 40;
    steps.push({ check: 'Extraction', data: {}, result: err.message || 'Failed' });
    return {
      sourceCodeScore: Math.min(100, sourceCodeScore),
      sourceCodeFindings: [],
      triggers,
      steps,
    };
  }
}
