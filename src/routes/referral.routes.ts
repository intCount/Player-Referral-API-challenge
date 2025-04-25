// src/routes/referral.routes.ts
import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requestMiddleware } from '../middlewares/request.middleware';
import { asHandler, asRequestWithPlayerHandler } from '../utils/request-handler.util';

const router = Router();
const referralController = new ReferralController();

// Generate referral link
router.get(
  '/link',
  asHandler(authMiddleware),
  asHandler(requestMiddleware),
  asRequestWithPlayerHandler(referralController.generateReferralLink)
);

// Get referred players
router.get(
  '/players',
  asHandler(authMiddleware),
  asHandler(requestMiddleware),
  asRequestWithPlayerHandler(referralController.getReferredPlayers)
);

// Get referral stats
router.get(
  '/stats',
  asHandler(authMiddleware),
  asHandler(requestMiddleware),
  asRequestWithPlayerHandler(referralController.getReferralStats)
);

export default router;