import express from 'express';
import { appConfig } from '../config/index.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    version: appConfig.version || '1.0.0'
  });
});

export default router;

