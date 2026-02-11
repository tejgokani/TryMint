import http from 'http';
import express from 'express';
import helmet from 'helmet';
import { appConfig, sessionConfig } from './config/index.js';
import apiRoutes from './routes/index.js';
import {
  requestLogger,
  corsMiddleware,
  errorHandler
} from './middleware/index.js';
import { createWebSocketServers } from './websocket/index.js';
import { sessionService } from './services/index.js';

const app = express();

// Global middleware
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(corsMiddleware);

// Mount versioned API
app.use('/v1', apiRoutes);

// Error handler (must be last)
app.use(errorHandler);

const server = http.createServer(app);

// Attach WebSocket servers (UI + Agent channels)
createWebSocketServers(server);

// Periodic session cleanup
setInterval(() => {
  sessionService.runCleanup();
}, sessionConfig.cleanupIntervalMs);

server.listen(appConfig.port, () => {
  // eslint-disable-next-line no-console
  console.log(`TRYMINT backend listening on port ${appConfig.port}`);
});

