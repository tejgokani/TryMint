/**
 * Command Parser - Parse shell commands into structured form
 */

/**
 * Parse command string into a structured representation
 * @param {string} command - Raw command string
 * @returns {object} Parsed command { raw, command, args, paths, hasPipe, hasRedirect }
 */
export function parse(command) {
  if (!command || typeof command !== 'string') {
    return { raw: '', command: '', args: [], paths: [], hasPipe: false, hasRedirect: false };
  }

  const trimmed = command.trim();
  const parts = splitCommand(trimmed);

  return {
    raw: trimmed,
    command: extractCommand(parts),
    args: extractArgs(parts),
    paths: extractPaths(parts),
    hasPipe: detectPipes(trimmed),
    hasRedirect: detectRedirects(trimmed),
  };
}

function splitCommand(cmd) {
  const parts = [];
  let current = '';
  let inQuote = null;

  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i];
    if (c === '"' || c === "'") {
      if (inQuote === c) {
        inQuote = null;
      } else if (!inQuote) {
        inQuote = c;
      }
      current += c;
    } else if (inQuote) {
      current += c;
    } else if (c === ' ' || c === '\t') {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else if (c === '|' || c === '>' || c === '<') {
      if (current) {
        parts.push(current);
        current = '';
      }
      if ((c === '>' || c === '<') && trimmed[i + 1] === c) {
        parts.push(c + c);
        i++;
      } else {
        parts.push(c);
      }
    } else {
      current += c;
    }
  }
  if (current) parts.push(current);
  return parts;
}

/**
 * Extract primary command from parsed parts
 */
export function extractCommand(parts) {
  if (!Array.isArray(parts) || parts.length === 0) return '';
  const first = parts.find((p) => typeof p === 'string' && !['|', '>', '<', '>>'].includes(p));
  return first ? first.toLowerCase() : '';
}

/**
 * Extract arguments (everything after command)
 */
export function extractArgs(parts) {
  if (!Array.isArray(parts) || parts.length < 2) return [];
  const cmd = extractCommand(parts);
  const idx = parts.indexOf(cmd);
  return parts.slice(idx + 1).filter((p) => typeof p === 'string' && !['|', '>', '<', '>>'].includes(p));
}

/**
 * Extract file paths from args (simple heuristic: starts with / or ., or contains /)
 */
export function extractPaths(parts) {
  const args = extractArgs(parts);
  const pathLike = /^[./]|\/|^~\//;
  return args.filter((a) => pathLike.test(a) || (a.includes('/') && a[0] !== '-'));
}

/**
 * Detect if command contains pipes
 */
export function detectPipes(command) {
  return typeof command === 'string' && command.includes('|');
}

/**
 * Detect if command contains redirects
 */
export function detectRedirects(command) {
  return typeof command === 'string' && (command.includes('>') || command.includes('<'));
}
