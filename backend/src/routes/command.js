import express from 'express';
import { commandController } from '../controllers/index.js';
import { authenticate, commandRateLimiter } from '../middleware/index.js';

const router = express.Router();

router.post('/simulate', authenticate, commandRateLimiter, commandController.simulate);
router.post('/execute', authenticate, commandRateLimiter, commandController.execute);
router.get('/history', authenticate, commandRateLimiter, commandController.getHistory);
router.delete('/:id', authenticate, commandRateLimiter, commandController.cancel);

export default router;

