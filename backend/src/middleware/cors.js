import cors from 'cors';
import { appConfig } from '../config/index.js';

export const corsMiddleware = cors({
  origin: appConfig.corsOrigin,
  credentials: true
});

