import cors from 'cors';
import { appConfig } from '../config/index.js';

// Parse comma-separated origins for production (e.g. Vercel + preview URLs)
const parseOrigins = (val) => {
  if (!val || val === '*') return ['*'];
  return val.split(',').map((s) => s.trim()).filter(Boolean);
};

const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    const allowed = parseOrigins(appConfig.corsOrigin);
    if (allowed.includes('*')) {
      return cb(null, true);
    }
    const devAllowed = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
    const all = [...new Set([...allowed, ...devAllowed])];
    if (!origin || all.includes(origin)) {
      return cb(null, true);
    }
    cb(null, allowed[0] ?? true);
  }
};

export const corsMiddleware = cors(corsOptions);

