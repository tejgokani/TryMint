import express from 'express';
import { agentController } from '../controllers/index.js';

const router = express.Router();

router.post('/connect', agentController.connect);
router.post('/heartbeat', agentController.heartbeat);
router.post('/disconnect', agentController.disconnect);

export default router;

