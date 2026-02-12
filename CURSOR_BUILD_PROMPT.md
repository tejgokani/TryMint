# 🚀 TRYMINT - COMPLETE REBUILD PROMPT

## CRITICAL CONTEXT

You are rebuilding TRYMINT - a web-based npm package security sandbox. The existing frontend UI and .env files should be KEPT. Everything else (backend, agent, sandbox logic) must be rebuilt FROM SCRATCH.

**DO NOT:**
- Delete or modify existing frontend components unless necessary for integration
- Remove .env files
- Make assumptions - ask if unclear
- Leave any loose ends or TODO comments
- Write code that might fail - test mentally before writing

**DO:**
- Build production-ready, error-free code
- Use TypeScript for type safety
- Handle ALL edge cases
- Write clean, documented code
- Follow the exact specifications below

---

## 🎯 PRODUCT VISION

TRYMINT is a web-based terminal sandbox that:
1. Simulates a real home directory environment in the browser
2. Lets users install and test npm packages in isolation
3. Has a `postmortem` command that performs deep security analysis
4. Shows file explorer on the right side that mirrors the terminal's current directory

---

## 🏗️ ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TRYMINT ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           FRONTEND (React)                          │   │
│  │  ┌─────────────────────────┐    ┌─────────────────────────────────┐ │   │
│  │  │     TERMINAL PANEL      │    │      FILE EXPLORER PANEL        │ │   │
│  │  │     (xterm.js)          │    │      (Tree View)                │ │   │
│  │  │                         │    │                                 │ │   │
│  │  │  user@trymint:~$        │    │  📁 home/                       │ │   │
│  │  │  > cd my-package        │    │    📁 user/                     │ │   │
│  │  │  > npm install          │    │      📁 my-package/             │ │   │
│  │  │  > postmortem           │    │        📄 package.json          │ │   │
│  │  │                         │    │        📄 index.js              │ │   │
│  │  └─────────────────────────┘    └─────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                              WebSocket + REST                               │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                           BACKEND (Node.js)                         │   │
│  │                                                                     │   │
│  │  • REST API for session management                                  │   │
│  │  • WebSocket for real-time terminal I/O                             │   │
│  │  • Postmortem analysis engine                                       │   │
│  │  • File system state management                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SANDBOX AGENT (WebContainers)                  │   │
│  │                                                                     │   │
│  │  • Full Node.js environment in browser                              │   │
│  │  • Virtual file system with home directory                          │   │
│  │  • npm install/run capability                                       │   │
│  │  • Behavior monitoring hooks                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 DIRECTORY STRUCTURE TO CREATE

```
trymint/
├── frontend/                    # KEEP EXISTING - only modify for integration
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal/
│   │   │   │   ├── Terminal.tsx           # xterm.js terminal component
│   │   │   │   ├── TerminalInput.tsx      # Command input handler
│   │   │   │   └── TerminalOutput.tsx     # Output renderer
│   │   │   ├── FileExplorer/
│   │   │   │   ├── FileExplorer.tsx       # Main file tree component
│   │   │   │   ├── FileNode.tsx           # Individual file/folder node
│   │   │   │   └── FileIcon.tsx           # Icon renderer
│   │   │   ├── PostmortemReport/
│   │   │   │   ├── PostmortemReport.tsx   # Full analysis report view
│   │   │   │   ├── RiskScore.tsx          # Risk score visualization
│   │   │   │   ├── FindingCard.tsx        # Individual finding display
│   │   │   │   └── RecommendationList.tsx # AI recommendations
│   │   │   └── Layout/
│   │   │       ├── SplitPane.tsx          # Terminal + Explorer split
│   │   │       └── Header.tsx             # Top navigation
│   │   ├── hooks/
│   │   │   ├── useTerminal.ts             # Terminal state management
│   │   │   ├── useFileSystem.ts           # File explorer state
│   │   │   ├── useWebSocket.ts            # WebSocket connection
│   │   │   └── usePostmortem.ts           # Postmortem analysis state
│   │   ├── services/
│   │   │   ├── api.ts                     # REST API client
│   │   │   ├── websocket.ts               # WebSocket client
│   │   │   └── sandbox.ts                 # WebContainer interface
│   │   └── types/
│   │       ├── terminal.ts
│   │       ├── filesystem.ts
│   │       └── postmortem.ts
│   └── .env                     # KEEP EXISTING
│
├── backend/                     # REBUILD FROM SCRATCH
│   ├── src/
│   │   ├── index.ts                       # Entry point
│   │   ├── config/
│   │   │   ├── index.ts                   # Config aggregator
│   │   │   └── env.ts                     # Environment variables
│   │   ├── routes/
│   │   │   ├── index.ts                   # Route aggregator
│   │   │   ├── session.ts                 # Session management routes
│   │   │   ├── filesystem.ts              # File system routes
│   │   │   └── postmortem.ts              # Analysis routes
│   │   ├── services/
│   │   │   ├── SessionService.ts          # Session lifecycle
│   │   │   ├── FileSystemService.ts       # Virtual FS management
│   │   │   ├── PostmortemService.ts       # Security analysis engine
│   │   │   └── AIService.ts               # OpenAI integration
│   │   ├── websocket/
│   │   │   ├── index.ts                   # WebSocket server
│   │   │   ├── handlers.ts                # Message handlers
│   │   │   └── terminal.ts                # Terminal I/O handler
│   │   ├── postmortem/
│   │   │   ├── index.ts                   # Postmortem orchestrator
│   │   │   ├── analyzers/
│   │   │   │   ├── DependencyAnalyzer.ts  # Dependency tree analysis
│   │   │   │   ├── CodePatternAnalyzer.ts # Suspicious code patterns
│   │   │   │   ├── BehaviorAnalyzer.ts    # Runtime behavior analysis
│   │   │   │   ├── VulnerabilityScanner.ts# CVE/OSV scanning
│   │   │   │   ├── LicenseAnalyzer.ts     # License compliance
│   │   │   │   └── ReputationAnalyzer.ts  # Maintainer/package reputation
│   │   │   ├── scorers/
│   │   │   │   ├── RiskScorer.ts          # Overall risk calculation
│   │   │   │   └── SeverityClassifier.ts  # Finding severity
│   │   │   └── reporters/
│   │   │       ├── ReportGenerator.ts     # Generate final report
│   │   │       └── RecommendationEngine.ts# AI-powered suggestions
│   │   ├── types/
│   │   │   ├── session.ts
│   │   │   ├── filesystem.ts
│   │   │   ├── postmortem.ts
│   │   │   └── websocket.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       ├── errors.ts
│   │       └── validators.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                     # KEEP EXISTING
│
├── agent/                       # REBUILD FROM SCRATCH
│   ├── src/
│   │   ├── index.ts                       # Agent entry point
│   │   ├── webcontainer/
│   │   │   ├── WebContainerManager.ts     # WebContainer lifecycle
│   │   │   ├── FileSystemProvider.ts      # Virtual FS with home dir
│   │   │   └── ProcessManager.ts          # Process spawning
│   │   ├── terminal/
│   │   │   ├── TerminalEmulator.ts        # PTY emulation
│   │   │   ├── CommandParser.ts           # Parse shell commands
│   │   │   ├── CommandExecutor.ts         # Execute commands
│   │   │   └── ShellBuiltins.ts           # cd, ls, pwd, etc.
│   │   ├── filesystem/
│   │   │   ├── VirtualFileSystem.ts       # In-memory FS
│   │   │   ├── HomeDirectory.ts           # Home dir structure
│   │   │   ├── PathResolver.ts            # Path resolution
│   │   │   └── FileWatcher.ts             # FS change events
│   │   ├── monitoring/
│   │   │   ├── BehaviorMonitor.ts         # Track all behavior
│   │   │   ├── NetworkMonitor.ts          # HTTP/fetch interception
│   │   │   ├── FileAccessMonitor.ts       # File read/write logging
│   │   │   └── ProcessMonitor.ts          # child_process logging
│   │   ├── npm/
│   │   │   ├── NpmRunner.ts               # npm install/run
│   │   │   ├── PackageResolver.ts         # Resolve package from npm
│   │   │   └── DependencyInstaller.ts     # Install dependencies
│   │   └── types/
│   │       ├── command.ts
│   │       ├── filesystem.ts
│   │       └── monitoring.ts
│   ├── package.json
│   └── tsconfig.json
│
└── shared/                      # Shared types between frontend/backend/agent
    ├── types/
    │   ├── index.ts
    │   ├── messages.ts                    # WebSocket message types
    │   ├── filesystem.ts                  # File system types
    │   └── postmortem.ts                  # Analysis types
    └── constants/
        ├── commands.ts                    # Built-in commands
        └── risks.ts                       # Risk levels/categories
```

---

## 🖥️ TERMINAL SPECIFICATIONS

### Home Directory Structure
The sandbox must simulate a real Linux home directory:

```
/
├── home/
│   └── user/                    # This is ~ (home)
│       ├── .bashrc
│       ├── .profile
│       ├── .npm/
│       ├── .config/
│       ├── Documents/
│       ├── Downloads/
│       └── projects/            # Default working directory for packages
│           └── my-package/      # User's package being tested
│               ├── package.json
│               ├── node_modules/
│               ├── src/
│               └── ...
```

### Terminal Prompt Format
```
user@trymint:~$ _                          # When in home
user@trymint:~/projects$ _                 # When in ~/projects
user@trymint:~/projects/my-package$ _      # When in package dir
```

### Built-in Commands (Must Implement ALL)

| Command | Description | Example |
|---------|-------------|---------|
| `cd <path>` | Change directory | `cd projects/my-package` |
| `ls [-la]` | List directory contents | `ls -la` |
| `pwd` | Print working directory | `pwd` → `/home/user/projects` |
| `mkdir <name>` | Create directory | `mkdir new-folder` |
| `touch <file>` | Create empty file | `touch index.js` |
| `cat <file>` | Print file contents | `cat package.json` |
| `rm [-rf] <path>` | Remove file/directory | `rm -rf node_modules` |
| `cp <src> <dest>` | Copy file/directory | `cp index.js backup.js` |
| `mv <src> <dest>` | Move/rename | `mv old.js new.js` |
| `echo <text>` | Print text | `echo "hello"` |
| `clear` | Clear terminal | `clear` |
| `npm <command>` | Run npm commands | `npm install lodash` |
| `node <file>` | Run Node.js file | `node index.js` |
| `postmortem` | **RUN SECURITY ANALYSIS** | `postmortem` |
| `exit` | End session | `exit` |

### Command Execution Flow

```typescript
// When user types a command:

1. Parse command string → { command: string, args: string[], flags: Record<string, boolean> }

2. Check if built-in command (cd, ls, pwd, etc.)
   - YES → Execute via ShellBuiltins
   - NO → Continue

3. Check if npm command
   - YES → Execute via NpmRunner in WebContainer
   - NO → Continue

4. Check if postmortem command
   - YES → Trigger PostmortemService analysis
   - NO → Continue

5. Check if node command
   - YES → Execute via WebContainer
   - NO → Return "command not found"

6. Stream output back to terminal via WebSocket
```

---

## 📂 FILE EXPLORER SPECIFICATIONS

### Behavior Requirements

1. **Tree View**: Show file tree on the right panel
2. **Sync with Terminal**: 
   - When user runs `cd folder`, the file explorer should expand and highlight that folder
   - Current directory should be visually indicated (bold/highlighted)
3. **Click to Navigate**:
   - Clicking a folder should run `cd <folder>` in terminal
   - Clicking a file should run `cat <file>` in terminal
4. **Real-time Updates**:
   - When files are created/deleted in terminal, explorer updates immediately
5. **Icons**:
   - Different icons for: folders, .js, .ts, .json, .md, package.json, node_modules

### File Explorer Component Structure

```typescript
interface FileNode {
  name: string;
  path: string;           // Full path from root
  type: 'file' | 'directory';
  children?: FileNode[];  // Only for directories
  expanded?: boolean;     // UI state
  size?: number;          // File size in bytes
  modified?: Date;        // Last modified
}

interface FileExplorerState {
  root: FileNode;
  currentPath: string;    // Synced with terminal's pwd
  selectedPath: string | null;
}
```

### File Explorer Events (WebSocket)

```typescript
// Frontend → Backend
{ type: 'fs:list', payload: { path: string } }
{ type: 'fs:read', payload: { path: string } }

// Backend → Frontend
{ type: 'fs:tree', payload: { root: FileNode } }
{ type: 'fs:changed', payload: { path: string, event: 'create' | 'delete' | 'modify' } }
{ type: 'fs:content', payload: { path: string, content: string } }
```

---

## 🔬 POSTMORTEM COMMAND SPECIFICATIONS

### What `postmortem` Does

When user runs `postmortem` in the terminal:

1. **Detect Package Location**: Find nearest `package.json` from current directory
2. **Run Comprehensive Analysis**: Execute all analyzers
3. **Generate Risk Score**: Calculate overall risk (0-100)
4. **Display Report**: Show formatted report in terminal + open detailed view

### Analysis Categories (Rubrics)

```typescript
interface PostmortemReport {
  packageName: string;
  packageVersion: string;
  analyzedAt: Date;
  overallRisk: RiskLevel;        // LOW | MEDIUM | HIGH | CRITICAL
  overallScore: number;          // 0-100
  
  categories: {
    dependencies: CategoryResult;
    codePatterns: CategoryResult;
    behavior: CategoryResult;
    vulnerabilities: CategoryResult;
    licenses: CategoryResult;
    reputation: CategoryResult;
  };
  
  findings: Finding[];
  recommendations: Recommendation[];
}

interface CategoryResult {
  name: string;
  score: number;                 // 0-100
  weight: number;                // How much this affects overall score
  status: 'pass' | 'warn' | 'fail';
  findings: Finding[];
}

interface Finding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  location?: string;             // File path or dependency name
  evidence?: string;             // Code snippet or data
  cwe?: string;                  // CWE ID if applicable
  remediation?: string;          // How to fix
}

interface Recommendation {
  priority: number;              // 1 = most important
  action: string;
  reason: string;
  effort: 'low' | 'medium' | 'high';
}
```

### Analysis Rubrics (Each Analyzer)

#### 1. Dependency Analyzer
| Check | Severity | Description |
|-------|----------|-------------|
| Outdated dependencies | medium | Dependencies with newer versions available |
| Deprecated dependencies | high | Dependencies marked as deprecated |
| Typosquatting detection | critical | Names similar to popular packages |
| Excessive dependencies | medium | >50 direct dependencies |
| Circular dependencies | medium | Circular dependency chains |
| Unmaintained | high | No updates in >2 years |

#### 2. Code Pattern Analyzer
| Check | Severity | Description |
|-------|----------|-------------|
| `eval()` usage | critical | Dynamic code execution |
| `Function()` constructor | critical | Dynamic code execution |
| `require()` with variable | high | Dynamic module loading |
| Base64 encoded strings | high | Potential obfuscation |
| Minified code in src | medium | Suspicious obfuscation |
| Shell command execution | high | `exec`, `spawn`, `execSync` |
| File system access | medium | `fs.readFileSync`, etc. |
| Environment variable access | medium | `process.env.*` |
| Network requests | low | `fetch`, `axios`, `http` |

#### 3. Behavior Analyzer (Runtime)
| Check | Severity | Description |
|-------|----------|-------------|
| Reads sensitive files | critical | ~/.ssh/*, ~/.aws/*, .env |
| Writes outside package dir | high | Files outside node_modules |
| Outbound network calls | high | HTTP requests during install |
| Environment variable reads | medium | Accessing env vars |
| Process spawning | medium | Spawning child processes |
| High CPU usage | low | Potential crypto mining |
| High memory usage | low | Memory exhaustion attack |

#### 4. Vulnerability Scanner
| Check | Severity | Description |
|-------|----------|-------------|
| Known CVEs | varies | CVEs in dependencies (OSV database) |
| GitHub Advisory | varies | GitHub security advisories |
| Snyk database | varies | Known vulnerabilities |

#### 5. License Analyzer
| Check | Severity | Description |
|-------|----------|-------------|
| No license | medium | Missing license file |
| GPL in dependencies | medium | Copyleft license |
| Unknown license | low | Non-standard license |
| License mismatch | low | Different licenses in deps |

#### 6. Reputation Analyzer
| Check | Severity | Description |
|-------|----------|-------------|
| New package | medium | <1 month old |
| Low downloads | low | <100 weekly downloads |
| Single maintainer | low | Bus factor risk |
| Recent maintainer change | high | Potential hijack |
| Suspicious publish patterns | high | Rapid version changes |

### Postmortem Terminal Output Format

```
user@trymint:~/projects/my-package$ postmortem

╔══════════════════════════════════════════════════════════════════════════════╗
║                           TRYMINT POSTMORTEM REPORT                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Package: my-package@1.0.0                                                   ║
║  Analyzed: 2026-02-12 15:30:00 UTC                                          ║
╚══════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────┐
│  OVERALL RISK SCORE                                                         │
│                                                                             │
│  ██████████████████████████░░░░░░░░░░░░░░  67/100  🟠 HIGH RISK            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY BREAKDOWN                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Dependencies      ████████░░  80/100  ✅ PASS                             │
│  Code Patterns     ██████░░░░  60/100  ⚠️  WARN                             │
│  Runtime Behavior  ████░░░░░░  40/100  ❌ FAIL                             │
│  Vulnerabilities   █████████░  90/100  ✅ PASS                             │
│  Licenses          ██████████  100/100 ✅ PASS                             │
│  Reputation        ███████░░░  70/100  ⚠️  WARN                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🔴 CRITICAL FINDINGS (1)                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [CRIT-001] SENSITIVE FILE ACCESS                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  Category: Runtime Behavior                                                 │
│  Location: src/utils/config.js:42                                          │
│                                                                             │
│  Package attempts to read ~/.aws/credentials during initialization.         │
│                                                                             │
│  Evidence:                                                                  │
│  │ const creds = fs.readFileSync(                                          │
│  │   path.join(os.homedir(), '.aws', 'credentials')                        │
│  │ );                                                                       │
│                                                                             │
│  Recommendation: This is highly suspicious behavior. Review the source     │
│  code to understand why AWS credentials are being accessed.                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🟠 HIGH FINDINGS (2)                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [HIGH-001] DYNAMIC CODE EXECUTION                                         │
│  Location: src/parser.js:156                                               │
│  Evidence: eval(userInput)                                                 │
│                                                                             │
│  [HIGH-002] OUTBOUND NETWORK CALL                                          │
│  Location: postinstall script                                              │
│  Evidence: curl https://analytics.unknown-domain.com/install               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  💡 RECOMMENDATIONS                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. [CRITICAL] Do not publish this package until the credential access     │
│     issue is resolved or explained.                                        │
│                                                                             │
│  2. [HIGH] Replace eval() with safer alternatives like JSON.parse() or     │
│     a proper parser library.                                               │
│                                                                             │
│  3. [MEDIUM] Remove or document the postinstall network call.              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Full report saved to: ~/projects/my-package/.trymint/postmortem-2026-02-12.json

user@trymint:~/projects/my-package$ _
```

---

## 🔌 WEBSOCKET MESSAGE PROTOCOL

### Message Format

```typescript
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id: string;                    // UUID for request/response matching
}
```

### Terminal Messages

```typescript
// Client → Server
{ type: 'terminal:input', payload: { command: string } }
{ type: 'terminal:resize', payload: { cols: number, rows: number } }
{ type: 'terminal:interrupt', payload: {} }  // Ctrl+C

// Server → Client
{ type: 'terminal:output', payload: { data: string } }
{ type: 'terminal:prompt', payload: { cwd: string, user: string } }
{ type: 'terminal:clear', payload: {} }
{ type: 'terminal:exit', payload: { code: number } }
```

### File System Messages

```typescript
// Client → Server
{ type: 'fs:list', payload: { path: string } }
{ type: 'fs:read', payload: { path: string } }
{ type: 'fs:watch', payload: { path: string } }

// Server → Client
{ type: 'fs:tree', payload: { root: FileNode, currentPath: string } }
{ type: 'fs:content', payload: { path: string, content: string, encoding: string } }
{ type: 'fs:changed', payload: { path: string, event: 'create' | 'delete' | 'modify', node?: FileNode } }
{ type: 'fs:error', payload: { path: string, error: string } }
```

### Postmortem Messages

```typescript
// Client → Server
{ type: 'postmortem:start', payload: { path: string } }
{ type: 'postmortem:cancel', payload: {} }

// Server → Client
{ type: 'postmortem:progress', payload: { stage: string, percent: number } }
{ type: 'postmortem:finding', payload: { finding: Finding } }
{ type: 'postmortem:complete', payload: { report: PostmortemReport } }
{ type: 'postmortem:error', payload: { error: string } }
```

### Session Messages

```typescript
// Client → Server
{ type: 'session:create', payload: { packageUrl?: string } }
{ type: 'session:destroy', payload: {} }

// Server → Client
{ type: 'session:ready', payload: { sessionId: string, homeDir: string } }
{ type: 'session:error', payload: { error: string } }
```

---

## 🔧 IMPLEMENTATION REQUIREMENTS

### WebContainer Integration

```typescript
// agent/src/webcontainer/WebContainerManager.ts

import { WebContainer } from '@webcontainer/api';

class WebContainerManager {
  private container: WebContainer;
  private fileSystem: VirtualFileSystem;
  
  async boot(): Promise<void> {
    this.container = await WebContainer.boot();
    await this.initializeHomeDirectory();
  }
  
  private async initializeHomeDirectory(): Promise<void> {
    // Create full home directory structure
    const homeStructure = {
      'home': {
        directory: {
          'user': {
            directory: {
              '.bashrc': { file: { contents: '# Bash configuration\nexport PS1="user@trymint:\\w$ "' } },
              '.profile': { file: { contents: '# Profile configuration' } },
              '.npm': { directory: {} },
              '.config': { directory: {} },
              'Documents': { directory: {} },
              'Downloads': { directory: {} },
              'projects': { directory: {} },
            }
          }
        }
      }
    };
    
    await this.container.mount(homeStructure);
  }
  
  async runCommand(command: string, cwd: string): Promise<WebContainerProcess> {
    return this.container.spawn('sh', ['-c', command], {
      cwd,
      env: {
        HOME: '/home/user',
        USER: 'user',
        PATH: '/usr/local/bin:/usr/bin:/bin',
        TERM: 'xterm-256color',
        // DO NOT expose real credentials
      }
    });
  }
  
  async installPackage(packageName: string, cwd: string): Promise<void> {
    const process = await this.container.spawn('npm', ['install', packageName], { cwd });
    // Stream output back to terminal
  }
  
  async readFile(path: string): Promise<string> {
    return await this.container.fs.readFile(path, 'utf-8');
  }
  
  async writeFile(path: string, content: string): Promise<void> {
    await this.container.fs.writeFile(path, content);
  }
  
  async readdir(path: string): Promise<string[]> {
    return await this.container.fs.readdir(path);
  }
  
  async mkdir(path: string): Promise<void> {
    await this.container.fs.mkdir(path, { recursive: true });
  }
  
  async rm(path: string, options?: { recursive?: boolean }): Promise<void> {
    await this.container.fs.rm(path, options);
  }
}

export default WebContainerManager;
```

### Shell Builtins Implementation

```typescript
// agent/src/terminal/ShellBuiltins.ts

class ShellBuiltins {
  private cwd: string = '/home/user';
  private home: string = '/home/user';
  private fs: WebContainerManager;
  
  constructor(fs: WebContainerManager) {
    this.fs = fs;
  }
  
  async cd(args: string[]): Promise<{ output: string; newCwd: string }> {
    let targetPath = args[0] || this.home;
    
    // Handle special paths
    if (targetPath === '~') targetPath = this.home;
    if (targetPath === '-') targetPath = this.previousCwd || this.cwd;
    if (targetPath === '..') targetPath = this.getParentDir(this.cwd);
    
    // Resolve relative paths
    if (!targetPath.startsWith('/')) {
      targetPath = this.resolvePath(this.cwd, targetPath);
    }
    
    // Check if directory exists
    try {
      const stat = await this.fs.stat(targetPath);
      if (!stat.isDirectory()) {
        return { output: `cd: not a directory: ${args[0]}`, newCwd: this.cwd };
      }
      this.previousCwd = this.cwd;
      this.cwd = targetPath;
      return { output: '', newCwd: this.cwd };
    } catch {
      return { output: `cd: no such file or directory: ${args[0]}`, newCwd: this.cwd };
    }
  }
  
  async ls(args: string[], flags: Record<string, boolean>): Promise<string> {
    const targetPath = args[0] ? this.resolvePath(this.cwd, args[0]) : this.cwd;
    
    try {
      const entries = await this.fs.readdir(targetPath);
      
      if (flags.l || flags.la || flags.a) {
        // Long format
        const details = await Promise.all(
          entries
            .filter(e => flags.a || flags.la || !e.startsWith('.'))
            .map(async (entry) => {
              const stat = await this.fs.stat(`${targetPath}/${entry}`);
              const type = stat.isDirectory() ? 'd' : '-';
              const size = stat.size.toString().padStart(8);
              const name = stat.isDirectory() ? `\x1b[34m${entry}\x1b[0m` : entry;
              return `${type}rwxr-xr-x  1 user user ${size} ${this.formatDate(stat.mtime)} ${name}`;
            })
        );
        return details.join('\n');
      } else {
        // Simple format
        return entries
          .filter(e => !e.startsWith('.'))
          .map(e => this.colorize(e, targetPath))
          .join('  ');
      }
    } catch {
      return `ls: cannot access '${args[0]}': No such file or directory`;
    }
  }
  
  pwd(): string {
    return this.cwd;
  }
  
  async mkdir(args: string[]): Promise<string> {
    if (!args[0]) return 'mkdir: missing operand';
    const targetPath = this.resolvePath(this.cwd, args[0]);
    try {
      await this.fs.mkdir(targetPath);
      return '';
    } catch (e) {
      return `mkdir: cannot create directory '${args[0]}': ${e.message}`;
    }
  }
  
  async touch(args: string[]): Promise<string> {
    if (!args[0]) return 'touch: missing file operand';
    const targetPath = this.resolvePath(this.cwd, args[0]);
    try {
      await this.fs.writeFile(targetPath, '');
      return '';
    } catch (e) {
      return `touch: cannot touch '${args[0]}': ${e.message}`;
    }
  }
  
  async cat(args: string[]): Promise<string> {
    if (!args[0]) return 'cat: missing file operand';
    const targetPath = this.resolvePath(this.cwd, args[0]);
    try {
      return await this.fs.readFile(targetPath);
    } catch {
      return `cat: ${args[0]}: No such file or directory`;
    }
  }
  
  async rm(args: string[], flags: Record<string, boolean>): Promise<string> {
    if (!args[0]) return 'rm: missing operand';
    const targetPath = this.resolvePath(this.cwd, args[0]);
    try {
      await this.fs.rm(targetPath, { recursive: flags.r || flags.rf });
      return '';
    } catch (e) {
      return `rm: cannot remove '${args[0]}': ${e.message}`;
    }
  }
  
  echo(args: string[]): string {
    return args.join(' ').replace(/^["']|["']$/g, '');
  }
  
  clear(): string {
    return '\x1b[2J\x1b[H';  // ANSI escape to clear screen
  }
  
  // Helper methods
  private resolvePath(base: string, relative: string): string {
    if (relative.startsWith('/')) return relative;
    if (relative.startsWith('~/')) return this.home + relative.slice(1);
    
    const parts = base.split('/').filter(Boolean);
    for (const part of relative.split('/')) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }
    return '/' + parts.join('/');
  }
  
  private getParentDir(path: string): string {
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/') || '/';
  }
  
  private colorize(name: string, basePath: string): string {
    // Directories in blue
    // Executables in green
    // etc.
    return name;
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  
  getCwd(): string {
    return this.cwd;
  }
  
  getPrompt(): string {
    const displayPath = this.cwd.replace(this.home, '~');
    return `user@trymint:${displayPath}$ `;
  }
}

export default ShellBuiltins;
```

### Behavior Monitoring

```typescript
// agent/src/monitoring/BehaviorMonitor.ts

interface BehaviorEvent {
  type: 'file_read' | 'file_write' | 'network' | 'process' | 'env_access';
  timestamp: Date;
  details: Record<string, any>;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
}

class BehaviorMonitor {
  private events: BehaviorEvent[] = [];
  private sensitivePatterns = [
    /\.ssh/,
    /\.aws/,
    /\.env/,
    /credentials/,
    /secrets/,
    /\.gnupg/,
    /\.kube\/config/,
  ];
  
  onFileAccess(path: string, operation: 'read' | 'write'): void {
    const severity = this.classifyFileSeverity(path, operation);
    this.events.push({
      type: operation === 'read' ? 'file_read' : 'file_write',
      timestamp: new Date(),
      details: { path, operation },
      severity
    });
  }
  
  onNetworkRequest(url: string, method: string): void {
    const severity = this.classifyNetworkSeverity(url);
    this.events.push({
      type: 'network',
      timestamp: new Date(),
      details: { url, method },
      severity
    });
  }
  
  onProcessSpawn(command: string, args: string[]): void {
    const severity = this.classifyProcessSeverity(command);
    this.events.push({
      type: 'process',
      timestamp: new Date(),
      details: { command, args },
      severity
    });
  }
  
  onEnvAccess(variable: string): void {
    const severity = this.classifyEnvSeverity(variable);
    this.events.push({
      type: 'env_access',
      timestamp: new Date(),
      details: { variable },
      severity
    });
  }
  
  private classifyFileSeverity(path: string, operation: string): BehaviorEvent['severity'] {
    // Critical: Sensitive files
    if (this.sensitivePatterns.some(p => p.test(path))) {
      return 'critical';
    }
    // High: Writing outside project directory
    if (operation === 'write' && !path.includes('/projects/')) {
      return 'high';
    }
    // Normal file operations
    return 'info';
  }
  
  private classifyNetworkSeverity(url: string): BehaviorEvent['severity'] {
    // Known safe domains
    const safeDomains = ['registry.npmjs.org', 'github.com', 'githubusercontent.com'];
    const domain = new URL(url).hostname;
    
    if (safeDomains.some(d => domain.endsWith(d))) {
      return 'info';
    }
    return 'high';
  }
  
  private classifyProcessSeverity(command: string): BehaviorEvent['severity'] {
    const dangerousCommands = ['curl', 'wget', 'nc', 'netcat', 'bash -c', 'sh -c', 'eval'];
    if (dangerousCommands.some(c => command.includes(c))) {
      return 'high';
    }
    return 'medium';
  }
  
  private classifyEnvSeverity(variable: string): BehaviorEvent['severity'] {
    const sensitiveVars = ['AWS_', 'API_KEY', 'SECRET', 'TOKEN', 'PASSWORD', 'PRIVATE'];
    if (sensitiveVars.some(v => variable.toUpperCase().includes(v))) {
      return 'high';
    }
    return 'medium';
  }
  
  getEvents(): BehaviorEvent[] {
    return [...this.events];
  }
  
  getCriticalEvents(): BehaviorEvent[] {
    return this.events.filter(e => e.severity === 'critical');
  }
  
  getHighEvents(): BehaviorEvent[] {
    return this.events.filter(e => e.severity === 'high');
  }
  
  clear(): void {
    this.events = [];
  }
}

export default BehaviorMonitor;
```

### Postmortem Service

```typescript
// backend/src/postmortem/index.ts

import DependencyAnalyzer from './analyzers/DependencyAnalyzer';
import CodePatternAnalyzer from './analyzers/CodePatternAnalyzer';
import BehaviorAnalyzer from './analyzers/BehaviorAnalyzer';
import VulnerabilityScanner from './analyzers/VulnerabilityScanner';
import LicenseAnalyzer from './analyzers/LicenseAnalyzer';
import ReputationAnalyzer from './analyzers/ReputationAnalyzer';
import RiskScorer from './scorers/RiskScorer';
import ReportGenerator from './reporters/ReportGenerator';

class PostmortemService {
  private analyzers = [
    new DependencyAnalyzer(),
    new CodePatternAnalyzer(),
    new BehaviorAnalyzer(),
    new VulnerabilityScanner(),
    new LicenseAnalyzer(),
    new ReputationAnalyzer(),
  ];
  
  private scorer = new RiskScorer();
  private reporter = new ReportGenerator();
  
  async analyze(
    packagePath: string, 
    fileSystem: any, 
    behaviorEvents: BehaviorEvent[],
    onProgress?: (stage: string, percent: number) => void
  ): Promise<PostmortemReport> {
    
    const results: CategoryResult[] = [];
    const allFindings: Finding[] = [];
    
    // Read package.json
    const packageJson = JSON.parse(await fileSystem.readFile(`${packagePath}/package.json`));
    
    let progress = 0;
    const progressStep = 100 / this.analyzers.length;
    
    // Run all analyzers
    for (const analyzer of this.analyzers) {
      onProgress?.(analyzer.name, progress);
      
      const result = await analyzer.analyze({
        packagePath,
        packageJson,
        fileSystem,
        behaviorEvents,
      });
      
      results.push(result);
      allFindings.push(...result.findings);
      progress += progressStep;
    }
    
    onProgress?.('Calculating risk score', 95);
    
    // Calculate overall score
    const { overallScore, overallRisk } = this.scorer.calculate(results);
    
    // Generate recommendations
    const recommendations = await this.reporter.generateRecommendations(allFindings);
    
    onProgress?.('Complete', 100);
    
    return {
      packageName: packageJson.name,
      packageVersion: packageJson.version,
      analyzedAt: new Date(),
      overallRisk,
      overallScore,
      categories: {
        dependencies: results.find(r => r.name === 'dependencies')!,
        codePatterns: results.find(r => r.name === 'codePatterns')!,
        behavior: results.find(r => r.name === 'behavior')!,
        vulnerabilities: results.find(r => r.name === 'vulnerabilities')!,
        licenses: results.find(r => r.name === 'licenses')!,
        reputation: results.find(r => r.name === 'reputation')!,
      },
      findings: allFindings.sort((a, b) => 
        this.severityOrder(a.severity) - this.severityOrder(b.severity)
      ),
      recommendations,
    };
  }
  
  private severityOrder(severity: string): number {
    const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
    return order[severity] ?? 5;
  }
  
  formatTerminalReport(report: PostmortemReport): string {
    // Return the formatted ASCII report as shown in the spec above
    return this.reporter.formatForTerminal(report);
  }
}

export default PostmortemService;
```

---

## ⚠️ CRITICAL ERROR HANDLING

### Every async operation MUST have error handling:

```typescript
// ❌ WRONG - No error handling
const result = await analyzePackage(path);

// ✅ CORRECT - Full error handling
try {
  const result = await analyzePackage(path);
  if (!result) {
    throw new Error('Analysis returned empty result');
  }
  return result;
} catch (error) {
  logger.error('Package analysis failed', { path, error: error.message });
  throw new AnalysisError(`Failed to analyze package: ${error.message}`);
}
```

### WebSocket Error Handling:

```typescript
ws.on('message', async (data) => {
  let message;
  try {
    message = JSON.parse(data.toString());
  } catch {
    ws.send(JSON.stringify({ type: 'error', payload: { error: 'Invalid JSON' } }));
    return;
  }
  
  try {
    const result = await handleMessage(message);
    ws.send(JSON.stringify({ 
      type: `${message.type}:response`, 
      payload: result,
      id: message.id 
    }));
  } catch (error) {
    ws.send(JSON.stringify({ 
      type: 'error', 
      payload: { 
        originalType: message.type,
        error: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        id: message.id
      }
    }));
  }
});
```

---

## 🧪 TESTING REQUIREMENTS

Before considering any component complete, verify:

1. **Terminal Commands**: Test ALL built-in commands work correctly
2. **Path Resolution**: Test `~`, `..`, `.`, absolute and relative paths
3. **File Explorer Sync**: Test that `cd` updates explorer, file changes reflect
4. **npm Operations**: Test `npm install` with a real package (lodash)
5. **Postmortem**: Test with a package containing suspicious patterns
6. **WebSocket**: Test reconnection, error handling, message ordering
7. **Error States**: Test what happens when things fail gracefully

---

## 🚀 EXECUTION ORDER

Build in this exact order:

1. **Shared Types** (`shared/`) - Create all TypeScript interfaces first
2. **Agent WebContainer** (`agent/src/webcontainer/`) - WebContainerManager, file system
3. **Agent Terminal** (`agent/src/terminal/`) - Command parsing, shell builtins
4. **Agent Monitoring** (`agent/src/monitoring/`) - Behavior monitoring hooks
5. **Backend WebSocket** (`backend/src/websocket/`) - Terminal I/O relay
6. **Backend REST** (`backend/src/routes/`) - Session management
7. **Backend Postmortem** (`backend/src/postmortem/`) - All analyzers
8. **Frontend Terminal** - xterm.js integration with existing UI
9. **Frontend Explorer** - File tree component with sync
10. **Frontend Postmortem** - Report visualization
11. **Integration Testing** - Connect all pieces, test end-to-end

---

## 📝 FINAL CHECKLIST

Before marking complete, ALL of these must work:

- [ ] `cd`, `ls`, `pwd`, `mkdir`, `touch`, `cat`, `rm`, `cp`, `mv`, `echo`, `clear` all work
- [ ] `cd ~` goes to home, `cd ..` goes up, `cd -` goes to previous
- [ ] `ls -la` shows hidden files with details
- [ ] Terminal prompt shows correct path (`user@trymint:~/projects$`)
- [ ] `npm install lodash` works and installs the package
- [ ] `npm run <script>` works if package.json has scripts
- [ ] `node index.js` executes JavaScript files
- [ ] `postmortem` command runs full analysis and shows formatted report
- [ ] File explorer shows home directory tree
- [ ] File explorer syncs when user runs `cd`
- [ ] Clicking folder in explorer runs `cd <folder>`
- [ ] Clicking file in explorer runs `cat <file>`
- [ ] Creating files in terminal updates explorer in real-time
- [ ] WebSocket connection is stable
- [ ] WebSocket reconnects automatically on disconnect
- [ ] No TypeScript compilation errors
- [ ] No runtime errors in console
- [ ] No unhandled promise rejections

---

## 🔥 BUILD THIS NOW

You have all the specifications. Build it piece by piece, test each component, and ensure everything works together seamlessly.

**NO ERRORS. NO TODOS. PRODUCTION READY.**

Start with: `shared/types/index.ts` → Define all interfaces first.

Then: `agent/src/webcontainer/WebContainerManager.ts` → Get WebContainer working.

Then: `agent/src/terminal/ShellBuiltins.ts` → Implement all shell commands.

Continue through the execution order until complete.

**GO.**
