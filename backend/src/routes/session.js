import express from 'express';
import { sessionController } from '../controllers/index.js';
import { authenticate, sessionRateLimiter } from '../middleware/index.js';

const router = express.Router();

router.post('/', authenticate, sessionRateLimiter, sessionController.create);
// Support both query param and path param for sessionId
router.get('/:sessionId?', authenticate, sessionRateLimiter, sessionController.getStatus);
router.post('/refresh', authenticate, sessionRateLimiter, sessionController.refresh);
// Support both body and path param for sessionId
router.delete('/:sessionId?', authenticate, sessionRateLimiter, sessionController.terminate);

export default router;

