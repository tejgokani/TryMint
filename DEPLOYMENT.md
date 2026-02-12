# TRYMINT Deployment Guide

Deploy **Backend** on Render, **Frontend** on Vercel, and run the **Agent** locally or in your CI environment.

---

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Vercel (Frontend)  │────▶│  Render (Backend)    │◀────│  Agent (Your Machine)│
│   trymint.vercel.app │     │  trymint.onrender.com│     │  npm run trymint     │
│   React SPA          │     │  Node + WebSocket    │     │  connect -s SESS -t  │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
        │                              │
        │  REST + WebSocket             │  WebSocket (session auth)
        └──────────────────────────────┘
```

---

## 1. Backend on Render

### Prerequisites
- GitHub repo connected to Render
- Render account (free tier works)

### Steps

1. **Create a new Web Service** on [Render Dashboard](https://dashboard.render.com/)
   - Connect your GitHub repository
   - Render will detect `render.yaml` or you can configure manually

2. **Manual Configuration** (if not using blueprint):
   - **Type:** Web Service
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run start`
   - **Instance Type:** Free (or paid for always-on)

3. **Environment Variables** (Settings → Environment):

   | Variable | Required | Example | Notes |
   |----------|----------|---------|-------|
   | `NODE_ENV` | Yes | `production` | |
   | `JWT_SECRET` | Yes | *(generate)* | `openssl rand -base64 32` |
   | `TRYMINT_CORS_ORIGIN` | Yes | `https://trymint.vercel.app` | Comma-separate for multiple (e.g. preview URLs) |
   | `FRONTEND_URL` | Yes | `https://trymint.vercel.app` | Where to redirect after OAuth login |
   | `GOOGLE_CLIENT_ID` | No | Your OAuth client ID | If using Google login |
   | `GOOGLE_CLIENT_SECRET` | No | Your OAuth secret | |
   | `GOOGLE_CALLBACK_URL` | No | `https://YOUR-BACKEND.onrender.com/v1/auth/callback` | Must match Google Console exactly |
   | `OPENAI_API_KEY` | No | `sk-...` | For AI summaries on scan |

4. **CORS for multiple origins** (e.g. production + preview):
   ```
   TRYMINT_CORS_ORIGIN=https://trymint.vercel.app,https://trymint-*.vercel.app
   ```

5. **Deploy** — Render auto-deploys on push to `main`.

6. **Note:** Free tier spins down after 15 min inactivity. First request may take 30–60s to wake.

### Backend URL
After deploy: `https://trymint-backend-XXXX.onrender.com`

### Google OAuth in Production (fix "callback crashed")

If Google login fails after redirect, configure these **exactly**:

1. **Render Environment Variables** (add/update):

   | Variable | Value |
   |----------|-------|
   | `GOOGLE_CALLBACK_URL` | `https://YOUR-SERVICE.onrender.com/v1/auth/callback` |
   | `FRONTEND_URL` | `https://YOUR-VERCEL-APP.vercel.app` |

   Replace `YOUR-SERVICE` and `YOUR-VERCEL-APP` with your actual URLs.

2. **Google Cloud Console** → [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials):

   - Edit your OAuth 2.0 Client ID (Web application)
   - **Authorized redirect URIs** → Add: `https://YOUR-SERVICE.onrender.com/v1/auth/callback`
   - **Authorized JavaScript origins** → Add: `https://YOUR-VERCEL-APP.vercel.app` and `https://YOUR-SERVICE.onrender.com`
   - Save

3. **Redeploy** Render after changing env vars.

4. **Test:** Click "Continue with Google" → you should land on the login page after auth (success or error message).

---

## 2. Frontend on Vercel

### Prerequisites
- Vercel account
- GitHub repo connected

### Steps

1. **Import Project** at [vercel.com/new](https://vercel.com/new)
   - Select your repo
   - **Root Directory:** `frontend` (important for monorepo)

2. **Build Settings** (Vercel auto-detects from `vercel.json`):
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables** (Settings → Environment Variables):

   | Variable | Required | Example |
   |----------|----------|---------|
   | `VITE_API_URL` | Yes | `https://trymint-backend-XXXX.onrender.com/v1` |
   | `VITE_GOOGLE_CLIENT_ID` | No | Your OAuth client ID |
   | `VITE_GITHUB_CLIENT_ID` | No | Your GitHub OAuth client ID |

4. **Deploy** — Vercel auto-deploys on push.

5. **Redeploy** after changing env vars — Vite bakes them into the build.

### Frontend URL
After deploy: `https://trymint-xxxx.vercel.app`

---

## 3. Agent (Local / CI)

The **Agent** is a **Node.js CLI** that runs on your machine (or CI runner). It connects to the backend via WebSocket and executes commands in an isolated sandbox.

### Why it runs locally
- **Security:** Real commands run in your environment, not on Render
- **Isolation:** Sandbox limits file/network access
- **No cloud runtime:** No need to host the agent; it connects on-demand

### Installation

```bash
# From repo root
cd agent
npm install
npm link   # Optional: makes `trymint` available globally
```

### Usage

1. **Start a session** in the web app (Frontend → Start Session).
2. **Copy credentials** (Session ID + Token).
3. **Connect the agent:**

   ```bash
   cd agent
   node src/cli/index.js connect --session=SESS_XXXX --token=YOUR_TOKEN
   ```

   Or with env vars:

   ```bash
   TRYMINT_WS_URL=https://trymint-backend-XXXX.onrender.com node src/cli/index.js connect --session=SESS_XXXX --token=YOUR_TOKEN
   ```

### Agent Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TRYMINT_WS_URL` | `ws://localhost:3000` | WebSocket URL (use `https://` for production; `ws`/`wss` are derived) |

For production:
```bash
export TRYMINT_WS_URL=https://trymint-backend-XXXX.onrender.com
```

### Running on Windows

The agent works on Windows (Node.js 18+). Use PowerShell or Command Prompt.

**Install:**
```powershell
npm install -g trymint-agent
```

**Set backend URL (PowerShell):**
```powershell
$env:TRYMINT_WS_URL="https://trymint.onrender.com"
trymint connect --session=SESS_XXX --token=YOUR_TOKEN
```

**Or in one line (PowerShell):**
```powershell
$env:TRYMINT_WS_URL="https://trymint.onrender.com"; trymint connect -s SESS_XXX -t YOUR_TOKEN
```

**Command Prompt (cmd):**
```cmd
set TRYMINT_WS_URL=https://trymint.onrender.com
trymint connect -s SESS_XXX -t YOUR_TOKEN
```

**Permanent env var (Windows):**
1. Search "Environment Variables" in Start
2. Edit "User variables" → "Path" or add new variable `TRYMINT_WS_URL` = `https://trymint.onrender.com`
3. Restart terminal

### Agent lifecycle

1. User starts a session in the browser → gets Session ID + Token.
2. User runs `trymint connect -s SESS_XXX -t TOKEN` locally.
3. Agent connects to backend WebSocket, binds to that session.
4. User runs `npm install express` in the web terminal.
5. Backend simulates the command, then sends it to the agent.
6. Agent executes in sandbox, streams output back.

### Running in CI

Example GitHub Actions:

```yaml
- name: Install TRYMINT Agent
  run: |
    cd agent && npm ci

- name: Connect and run commands
  env:
    TRYMINT_WS_URL: ${{ secrets.TRYMINT_WS_URL }}
  run: |
    cd agent
    node src/cli/index.js connect --session=${{ secrets.SESSION_ID }} --token=${{ secrets.SESSION_TOKEN }} &
    sleep 5
    # Your build/test commands that use the sandbox
```

For CI, you’d typically create a session via API, pass credentials as secrets, and run the agent in the background.

---

## Post-Deployment Checklist

- [ ] Backend health: `curl https://YOUR-BACKEND.onrender.com/v1/health`
- [ ] Frontend loads and shows login/landing
- [ ] CORS: No "blocked by CORS" errors when frontend calls backend
- [ ] Create session in UI → copy credentials → run agent locally → verify "Agent connected"
- [ ] Run `npm install lodash` in sandbox terminal → verify execution

---

## Troubleshooting

### Backend

| Issue | Fix |
|-------|-----|
| 503 on first request | Free tier cold start; wait 30–60s |
| CORS errors | Add exact frontend URL to `TRYMINT_CORS_ORIGIN` |
| WebSocket fails | Ensure Render web service (not static site); Render supports WS on same URL |

### Frontend

| Issue | Fix |
|-------|-----|
| "Cannot reach backend" | Set `VITE_API_URL` and redeploy |
| 404 on refresh | `vercel.json` rewrites should send all routes to `index.html` |

### Agent

| Issue | Fix |
|-------|-----|
| Connection refused | Set `TRYMINT_WS_URL` to your backend URL (e.g. `https://...onrender.com`) |
| 4401 Unauthorized | Session ID/token invalid or expired; create a new session |
| "Agent disconnected" | Check network; ensure backend is reachable |
