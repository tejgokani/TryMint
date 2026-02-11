# Simulation Directory

This directory contains the command simulation engine.

## Structure

```
simulation/
├── engine.ts            # Simulation engine
├── sandbox.ts           # Sandbox environment
├── analyzer.ts          # Command analyzer
└── risk.ts              # Risk assessment
```

## Component Descriptions

### engine.ts
Core simulation engine.

**Responsibilities:**
- Coordinate simulation process
- Manage sandbox lifecycle
- Collect simulation results
- Generate simulation report

**Flow:**
1. Parse command
2. Create sandbox environment
3. Analyze command impact
4. Execute in sandbox (dry-run)
5. Collect changes
6. Assess risk
7. Generate report

### sandbox.ts
Sandbox environment.

**Responsibilities:**
- Create isolated environment
- Mount filesystem overlay
- Capture filesystem changes
- Track resource access
- Clean up after simulation

**Isolation:**
- Filesystem overlay
- Environment isolation
- Network restrictions
- Resource limits

### analyzer.ts
Command analyzer.

**Responsibilities:**
- Parse command syntax
- Identify command type
- Detect dangerous operations
- List affected resources
- Identify side effects

**Analysis:**
- File operations
- Network operations
- System operations
- Destructive operations

### risk.ts
Risk assessment.

**Responsibilities:**
- Calculate risk score
- Categorize risk level
- Generate risk warnings
- Recommend actions

**Risk Levels:**
- `LOW` - Safe operations
- `MEDIUM` - Caution advised
- `HIGH` - Significant impact
- `CRITICAL` - Dangerous operation
