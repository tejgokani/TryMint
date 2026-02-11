# Isolation Directory

This directory contains directory capability-based isolation.

## Structure

```
isolation/
├── capabilities.ts      # Capability management
├── validator.ts         # Path validation
└── sandbox.ts           # Filesystem sandbox
```

## Component Descriptions

### capabilities.ts
Capability management.

**Responsibilities:**
- Parse capability configuration
- Manage allowed directories
- Check directory access
- Handle capability inheritance
- Log access attempts

**Capability Model:**
```
Capability = {
  path: string,           # Absolute path
  permissions: string[],  # read, write, execute
  recursive: boolean      # Include subdirectories
}
```

**Operations:**
- `hasCapability(path, permission)` - Check access
- `addCapability(capability)` - Add capability
- `removeCapability(path)` - Remove capability
- `listCapabilities()` - List all capabilities

### validator.ts
Path validation.

**Responsibilities:**
- Validate requested paths
- Resolve real paths
- Detect path traversal
- Check against capabilities
- Handle symlinks

**Validations:**
- Path exists
- Path is within allowed directories
- No traversal attempts (..)
- Symlink target is allowed
- Path is normalized

### sandbox.ts
Filesystem sandbox.

**Responsibilities:**
- Create sandboxed environment
- Restrict filesystem access
- Intercept filesystem calls
- Log access violations
- Enforce capability rules

**Enforcement:**
- Block unauthorized reads
- Block unauthorized writes
- Block unauthorized execution
- Log violation attempts
