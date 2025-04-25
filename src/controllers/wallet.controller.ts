// src/controllers/wallet.controller.ts
import { Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  public getWallet = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const wallet = await this.walletService.getWalletByPlayerId(playerId);
      
      res.status(200).json({
        success: true,
        data: {
          wallet,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public deposit = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const { amount } = req.body;
      
      const wallet = await this.walletService.deposit(playerId, amount);
      
      res.status(200).json({
        success: true,
        data: {
          wallet,
          message: `Successfully deposited ${amount} units`,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public withdraw = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const { amount } = req.body;
      
      const wallet = await this.walletService.withdraw(playerId, amount);
      
      res.status(200).json({
        success: true,
        data: {
          wallet,
          message: `Successfully withdrawn ${amount} units`,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getTransactionHistory = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const transactions = await this.walletService.getTransactionHistory(playerId);
      
      res.status(200).json({
        success: true,
        data: {
          transactions,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}