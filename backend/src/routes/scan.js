import express from 'express';
import { scanController } from '../controllers/index.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Public scan - rate limit to prevent abuse (10 scans per 5 min per IP)
const scanRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/package', scanRateLimiter, scanController.scanPackage);

export default router;
