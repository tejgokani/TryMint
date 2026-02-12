/**
 * Package Manager Risk Analyzer
 * Analyzes npm/yarn/pnpm install commands. Fetches real metadata from npm registry.
 * No mock data. If fetch fails, marks as unknown.
 */

const NPM_REGISTRY = 'https://registry.npmjs.org';
const FETCH_TIMEOUT_MS = 5000;

// Extract package names from npm install command
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
  }
  if (lowered.startsWith('yarn add ')) {
    const rest = command.replace(/^yarn\s+add\s+/, '').trim();
    const tokens = rest.split(/\s+/);
    for (const t of tokens) {
      if (t.startsWith('-') || t.startsWith('--')) break;
      if (t) packages.push(t);
    }
  }

  return [...new Set(packages)].filter(Boolean);
}

async function fetchPackageMetadata(packageName) {
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

function countTransitiveDeps(deps) {
  if (!deps || typeof deps !== 'object') return 0;
  let count = Object.keys(deps).length;
  return count;
}

function getInstallScriptsFromPackage(pkgMetadata) {
  if (!pkgMetadata) return { hasScripts: false, scripts: [] };
  const versions = pkgMetadata.versions || {};
  const latestTag = pkgMetadata['dist-tags']?.latest;
  const versionData = versions[latestTag] || Object.values(versions)[0];
  const scripts = versionData?.scripts || {};
  const installScripts = ['preinstall', 'install', 'postinstall', 'prepublish', 'prepare'];
  const found = installScripts.filter((s) => scripts[s]);
  return { hasScripts: found.length > 0, scripts: found };
}

function getPublishTime(pkgMetadata) {
  if (!pkgMetadata) return null;
  const versions = pkgMetadata.versions || {};
  const latestTag = pkgMetadata['dist-tags']?.latest;
  const versionData = versions[latestTag] || Object.values(versions)[0];
  const time = pkgMetadata.time;
  if (typeof time === 'object' && latestTag && time[latestTag]) return time[latestTag];
  if (typeof time === 'object' && time?.modified) return time.modified;
  return null;
}

export async function analyzePackageManager(command) {
  const steps = [];
  const triggers = [];
  let dependencyRisk = 0;
  let dependencyDepth = 0;
  let transitiveCount = 0;
  let hasInstallScripts = false;
  let installScriptsList = [];
  let recentlyPublished = false;
  let publishAge = 'unknown';

  const lowered = command.toLowerCase();
  const isPackageCommand =
    lowered.startsWith('npm install') ||
    lowered.startsWith('npm i ') ||
    lowered.startsWith('yarn add ') ||
    lowered.startsWith('pnpm add ') ||
    lowered.startsWith('pnpm i ');

  if (!isPackageCommand) {
    steps.push({ check: 'Package command detection', data: {}, result: 'Not a package install command' });
    return {
      dependencyRisk: 0,
      dependencyDepth: 0,
      transitiveCount: 0,
      hasInstallScripts: false,
      installScriptsList: [],
      recentlyPublished: false,
      publishAge: 'unknown',
      triggers,
      steps,
    };
  }

  const packages = extractPackageNames(command);
  steps.push({
    check: 'Package extraction',
    data: { packages },
    result: `Found ${packages.length} package(s) to install`,
  });

  if (packages.length === 0) {
    dependencyRisk = 30;
    triggers.push('Package install without specific package (may install all dependencies)');
    steps.push({ check: 'Package resolution', data: {}, result: 'No specific package - installs from package.json' });
  }

  for (const pkg of packages) {
    const metadata = await fetchPackageMetadata(pkg);

    if (!metadata) {
      triggers.push(`Package ${pkg}: metadata unavailable (registry fetch failed)`);
      dependencyRisk = Math.max(dependencyRisk, 50);
      steps.push({ check: `Fetch ${pkg}`, data: {}, result: 'Registry fetch failed - unknown risk' });
      continue;
    }

    const scriptsResult = getInstallScriptsFromPackage(metadata);
    if (scriptsResult.hasScripts) {
      hasInstallScripts = true;
      installScriptsList = [...new Set([...installScriptsList, ...scriptsResult.scripts])];
      triggers.push(`Package ${pkg}: has install scripts (${scriptsResult.scripts.join(', ')})`);
      dependencyRisk = Math.max(dependencyRisk, 65);
    }

    const latestVer = metadata['dist-tags']?.latest;
    const versionData = metadata.versions?.[latestVer];
    if (versionData?.dependencies) {
      const direct = countTransitiveDeps(versionData.dependencies);
      transitiveCount += direct;
      dependencyDepth = Math.max(dependencyDepth, 1);
    }

    const publishTime = getPublishTime(metadata);
    if (publishTime) {
      const publishDate = new Date(publishTime);
      const daysSince = (Date.now() - publishDate.getTime()) / (24 * 60 * 60 * 1000);
      publishAge = `${Math.floor(daysSince)} days ago`;
      if (daysSince < 7) {
        recentlyPublished = true;
        triggers.push(`Package ${pkg}: recently published (${Math.floor(daysSince)} days ago)`);
        dependencyRisk = Math.max(dependencyRisk, 55);
      }
    }

    steps.push({
      check: `Analyze ${pkg}`,
      data: {
        hasScripts: scriptsResult.hasScripts,
        depCount: versionData?.dependencies ? Object.keys(versionData.dependencies).length : 0,
        publishAge,
      },
      result: `Analyzed from registry`,
    });
  }

  if (transitiveCount > 0) {
    dependencyDepth = Math.min(10, Math.ceil(Math.log2(transitiveCount + 1)));
    if (transitiveCount > 50) {
      triggers.push(`High transitive dependency count: ${transitiveCount}+`);
      dependencyRisk = Math.max(dependencyRisk, 50);
    }
  }

  if (dependencyRisk === 0 && packages.length > 0) {
    dependencyRisk = 35;
    triggers.push('Network request to npm registry');
  }

  return {
    dependencyRisk: Math.min(100, dependencyRisk),
    dependencyDepth,
    transitiveCount,
    hasInstallScripts,
    installScriptsList,
    recentlyPublished,
    publishAge,
    triggers,
    steps,
  };
}
