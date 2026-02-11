import express from 'express';
import { authController } from '../controllers/index.js';
import { authRateLimiter } from '../middleware/index.js';

const router = express.Router();

router.post('/google', authRateLimiter, authController.initiateOAuth);
router.get('/callback', authRateLimiter, authController.handleCallback);
router.post('/logout', authRateLimiter, authController.logout);
router.get('/me', authRateLimiter, authController.getMe);

export default router;

