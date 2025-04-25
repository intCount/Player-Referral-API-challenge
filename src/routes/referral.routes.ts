// src/routes/referral.routes.ts
import { Router } from 'express';
import { ReferralController } from '../controllers/referral.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { CustomRequestHandler } from '../interfaces/express.interface';

const router = Router();
const referralController = new ReferralController();

// Generate referral link
router.get(
  '/link',
  authMiddleware as CustomRequestHandler,
  referralController.generateReferralLink
);

// Get referred players
router.get(
  '/players',
  authMiddleware as CustomRequestHandler,
  referralController.getReferredPlayers
);

// Get referral stats
router.get(
  '/stats',
  authMiddleware as CustomRequestHandler,
  referralController.getReferralStats
);

export default router;