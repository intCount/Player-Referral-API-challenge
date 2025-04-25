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