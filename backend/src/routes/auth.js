import express from 'express';
import { authController } from '../controllers/index.js';
import { authRateLimiter, authenticate } from '../middleware/index.js';

const router = express.Router();

router.post('/login', authRateLimiter, authController.login);
router.post('/google', authRateLimiter, authController.initiateOAuth);
router.get('/callback', authRateLimiter, authController.handleCallback);
router.post('/logout', authenticate, authRateLimiter, authController.logout);
router.get('/me', authenticate, authRateLimiter, authController.getMe);

export default router;

