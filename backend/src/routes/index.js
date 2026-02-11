import express from 'express';
import authRoutes from './auth.js';
import sessionRoutes from './session.js';
import commandRoutes from './command.js';
import agentRoutes from './agent.js';
import healthRoutes from './health.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/session', sessionRoutes);
router.use('/command', commandRoutes);
router.use('/agent', agentRoutes);
router.use('/health', healthRoutes);

export default router;

