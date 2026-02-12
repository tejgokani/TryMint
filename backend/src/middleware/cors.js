import cors from 'cors';
import { appConfig } from '../config/index.js';

// In development, allow localhost and 127.0.0.1 (Vite can serve from either)
const corsOptions = {
  credentials: true,
  origin: (origin, cb) => {
    if (process.env.NODE_ENV !== 'development') {
      return cb(null, appConfig.corsOrigin);
    }
    const allowed = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || allowed.includes(origin)) {
      return cb(null, true);
    }
    cb(null, appConfig.corsOrigin);
  }
};

export const corsMiddleware = cors(corsOptions);

