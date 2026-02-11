# Agent Isolation

> Directory capability-based isolation

## Purpose

Enforces security boundaries by validating command access against directory capabilities. Prevents unauthorized file system access.

## File Map

| File | Purpose |
|------|---------|
| `index.js` | Isolation manager |
| `capabilities.js` | Capability checker |
| `sandbox.js` | Sandbox environment setup |
| `paths.js` | Path validation utilities |

## Capability Model

Capabilities are directory paths that the session is allowed to access:

```
capabilities: [
  "/home/user/projects/myapp",
  "/tmp/trymint-workspace"
]
```

## Capability Checker (capabilities.js)

| Function | Purpose |
|----------|---------|
| `canAccess(path, capabilities)` | Check if path is allowed |
| `extractPaths(command)` | Extract paths from command |
| `validateCommand(command, capabilities)` | Validate full command |
| `getViolations(command, capabilities)` | List violations |

## Path Validation (paths.js)

| Function | Purpose |
|----------|---------|
| `resolve(path)` | Resolve to absolute path |
| `normalize(path)` | Normalize path |
| `isSubPath(child, parent)` | Check containment |
| `followSymlinks(path)` | Resolve symlinks |
| `detectEscape(path, root)` | Detect escape attempts |

## Security Checks

### Path Escape Prevention
- `../` traversal detection
- Symlink resolution and validation
- Absolute path enforcement
- Canonicalization before check

### Command Analysis
- Redirect target validation (`>`, `>>`)
- Pipe destination validation (`|`)
- Background job validation (`&`)
- Subshell command extraction

## Sandbox Environment (sandbox.js)

| Function | Purpose |
|----------|---------|
| `createEnvironment(capabilities)` | Build safe environment |
| `sanitizeEnv(env)` | Remove dangerous env vars |
| `setWorkingDir(path, capabilities)` | Set safe working dir |
| `restrictPath(env, capabilities)` | Restrict PATH |

## Violation Response

When a capability violation is detected:
1. Block the command
2. Log the violation
3. Report to backend
4. Return detailed error to user

## Examples

```
Allowed: /home/user/project

✓ cat /home/user/project/file.txt
✓ ls /home/user/project/src
✗ cat /etc/passwd
✗ rm -rf /
✗ cat /home/user/project/../../../etc/passwd
```
