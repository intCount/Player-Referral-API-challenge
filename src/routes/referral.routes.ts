// src/routes/referral.routes.ts
import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CustomRequestHandler } from '../interfaces/express.interface';
import { asHandler } from '../utils/request-handler.util';

const router = Router();
const referralController = new ReferralController();

// Generate referral link
router.get(
  '/link',
  asHandler(requestMiddleware),
  referralController.generateReferralLink
);

// Get referred players
router.get(
  '/players',
  asHandler(requestMiddleware),
  referralController.getReferredPlayers
);

// Get referral stats
router.get(
  '/stats',
  asHandler(requestMiddleware),
  referralController.getReferralStats
);

export default router;