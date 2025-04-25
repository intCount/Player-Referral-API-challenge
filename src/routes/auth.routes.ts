// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { Validator } from '../utils/validator';
import { requestMiddleware } from '../middlewares/request.middleware';

const router = Router();
const authController = new AuthController();

// Register a new player
router.post(
  '/register',
  requestMiddleware,
  validationMiddleware(Validator.validatePlayerRegistration),
  authController.register
);

// Login existing player
router.post(
  '/login',
  validationMiddleware(Validator.validatePlayerLogin),
  authController.login
);

export default router;

// src/routes/player.routes.ts
import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const playerController = new PlayerController();

// Get player profile
router.get(
  '/profile',
  authMiddleware,
  playerController.getProfile
);

export default router;

// src/routes/wallet.routes.ts
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { Validator } from '../utils/validator';

const router = Router();
const walletController = new WalletController();

// Get wallet balance
router.get(
  '/',
  authMiddleware,
  walletController.getWallet
);

// Deposit to wallet
router.post(
  '/deposit',
  authMiddleware,
  validationMiddleware(Validator.validateDeposit),
  walletController.deposit
);

// Withdraw from wallet
router.post(
  '/withdraw',
  authMiddleware,
  validationMiddleware(Validator.validateWithdrawal),
  walletController.withdraw
);

// Get transaction history
router.get(
  '/transactions',
  authMiddleware,
  walletController.getTransactionHistory
);

export default router;

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