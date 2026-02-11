import express from 'express';
import { sessionController } from '../controllers/index.js';
import { authenticate, sessionRateLimiter } from '../middleware/index.js';

const router = express.Router();

router.post('/', authenticate, sessionRateLimiter, sessionController.create);
router.get('/', authenticate, sessionRateLimiter, sessionController.getStatus);
router.post('/refresh', authenticate, sessionRateLimiter, sessionController.refresh);
router.delete('/', authenticate, sessionRateLimiter, sessionController.terminate);

export default router;

