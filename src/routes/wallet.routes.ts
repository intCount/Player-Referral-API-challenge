// src/routes/wallet.routes.ts
import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { Validator } from '../utils/validator';
import { asHandler, asRequestWithPlayerHandler } from '../utils/request-handler.util';

const router = Router();
const walletController = new WalletController();

// Get wallet balance
router.get(
  '/',
  asHandler(authMiddleware),
  asRequestWithPlayerHandler(walletController.getWallet)
);

// Deposit to wallet
router.post(
  '/deposit',
  asHandler(authMiddleware),
  validationMiddleware(Validator.validateDeposit),
  asRequestWithPlayerHandler(walletController.deposit)
);

// Withdraw from wallet
router.post(
  '/withdraw',
  asHandler(authMiddleware),
  validationMiddleware(Validator.validateWithdrawal),
  asRequestWithPlayerHandler(walletController.withdraw)
);

// Get transaction history
router.get(
  '/transactions',
  asHandler(authMiddleware),
  asRequestWithPlayerHandler(walletController.getTransactionHistory)
);

export default router;