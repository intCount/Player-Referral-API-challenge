// src/routes/referral.routes.ts
import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const referralController = new ReferralController();

// Generate referral link
router.get(
  '/link',
  authMiddleware,
  referralController.generateReferralLink
);

// Get referred players
router.get(
  '/players',
  authMiddleware,
  referralController.getReferredPlayers
);

// Get referral stats
router.get(
  '/stats',
  authMiddleware,
  referralController.getReferralStats
);

export default router;