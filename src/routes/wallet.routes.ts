// src/routes/wallet.routes.ts
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { Validator } from '../utils/validator';
import { CustomRequestHandler } from '../interfaces/express.interface';
import { asHandler } from '../utils/request-handler.util';

const router = Router();
const walletController = new WalletController();

// Get wallet balance
router.get(
  '/',
  authMiddleware as CustomRequestHandler,
  walletController.getWallet
);

// Deposit to wallet
router.post(
  '/deposit',
  authMiddleware as CustomRequestHandler,
  validationMiddleware(Validator.validateDeposit),
  walletController.deposit
);

// Withdraw from wallet
router.post(
  '/withdraw',
  authMiddleware as CustomRequestHandler,
  validationMiddleware(Validator.validateWithdrawal),
  walletController.withdraw
);

// Get transaction history
router.get(
  '/transactions',
  authMiddleware as CustomRequestHandler,
  walletController.getTransactionHistory
);

export default router;