import express from 'express';
import { postmortemController } from '../controllers/index.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const postmortemRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', postmortemRateLimiter, postmortemController.runPostmortem);

export default router;
