// Application-level configuration (ports, env, CORS, etc.)

export const appConfig = {
  env: process.env.NODE_ENV || process.env.TRYMINT_ENV || 'development',
  port: Number(process.env.TRYMINT_PORT || 3000),
  logLevel: process.env.TRYMINT_LOG_LEVEL || 'info',
  corsOrigin: process.env.TRYMINT_CORS_ORIGIN || '*'
};

