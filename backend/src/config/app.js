// Application-level configuration (ports, env, CORS, etc.)
// Render/Heroku set PORT; use TRYMINT_PORT for local dev
const PORT = process.env.PORT || process.env.TRYMINT_PORT || 3000;

export const appConfig = {
  env: process.env.NODE_ENV || process.env.TRYMINT_ENV || 'development',
  port: Number(PORT),
  logLevel: process.env.TRYMINT_LOG_LEVEL || 'info',
  // Comma-separated for multiple origins (e.g. Vercel + preview). Use * for allow-all.
  corsOrigin: process.env.TRYMINT_CORS_ORIGIN || (process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '*')
};

