# TRYMINT Prototype – 1-Hour Demo

## Quick Start (2 terminals)

**Terminal 1 – Backend**
```bash
cd backend && npm run dev
```

**Terminal 2 – Frontend**
```bash
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

## Demo Flow

1. **Landing** → Click **"Scan Package"**
2. **Scan page** → Click a quick chip (`express`, `lodash`, `chalk`) or type any npm package
3. **Results** → View risk score, findings, and behavior summary

## What Works

- **Package scan** – No signup. Paste package name → get risk report.
- **Risk engine** – Analyzes dependencies, install scripts, network, behavioral patterns.
- **Report** – Score 0–100, CRITICAL/HIGH/MEDIUM/LOW findings.

## Optional: Full Sandbox

For terminal + real execution: log in → Start Session → Launch Sandbox. Requires agent: `cd agent && node src/cli/index.js connect --session=<id> --token=<token>`.

---

## Troubleshooting

### "Network connection failed" / "Backend not reachable"

1. **Backend must be running** – Start it in a separate terminal: `cd backend && npm run dev`
2. **Port 3000 in use** – Stop other processes on port 3000, or set `TRYMINT_PORT=3001` in backend `.env`
3. **Frontend .env** – For dev with proxy, leave `VITE_API_URL` unset or empty. If set to `http://localhost:3000/v1`, ensure backend is on that port.

### Port conflicts

- Backend default: 3000
- Frontend default: 5173  
- Set `TRYMINT_PORT` (backend) or use `--port` for Vite if needed.

### Production build

Set `VITE_API_URL` to your API base URL (e.g. `https://api.example.com/v1`) before building.
