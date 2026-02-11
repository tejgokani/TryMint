// Minimal logger abstraction (can be swapped for Winston/Pino later)

import { appConfig } from '../config/index.js';

function log(level, message, meta) {
  const payload = {
    level,
    message,
    ...(meta || {}),
    timestamp: new Date().toISOString()
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
  debug: (message, meta) => {
    if (appConfig.logLevel === 'debug') {
      log('debug', message, meta);
    }
  }
};

