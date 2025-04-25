// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ipAddress = req.ip || '';
      const originUrl = req.headers.origin || '';
      
      const { player, token } = await this.authService.register(req.body, ipAddress, originUrl);
      
      res.status(201).json({
        success: true,
        data: {
          player: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            referralCode: player.referralCode,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { player, token } = await this.authService.login(req.body);
      
      res.status(200).json({
        success: true,
        data: {
          player: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            referralCode: player.referralCode,
          },
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

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

// src/controllers/referral.controller.ts
import { Response, NextFunction } from 'express';
import { ReferralService } from '../services/referral.service';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export class ReferralController {
  private referralService: ReferralService;

  constructor() {
    this.referralService = new ReferralService();
  }

  public generateReferralLink = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      
      const referralLink = await this.referralService.generateReferralLink(playerId, baseUrl);
      
      res.status(200).json({
        success: true,
        data: {
          referralLink,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getReferredPlayers = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const referredPlayers = await this.referralService.getReferredPlayers(playerId);
      
      res.status(200).json({
        success: true,
        data: {
          referredPlayers,
          count: referredPlayers.length,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getReferralStats = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const stats = await this.referralService.getReferralStats(playerId);
      
      res.status(200).json({
        success: true,
        data: {
          stats,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

// src/controllers/player.controller.ts
import { Response, NextFunction } from 'express';
import { PlayerService } from '../services/player.service';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export class PlayerController {
  private playerService: PlayerService;

  constructor() {
    this.playerService = new PlayerService();
  }

  public getProfile = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerId = req.player.id;
      const profile = await this.playerService.getPlayerProfile(playerId);
      
      res.status(200).json({
        success: true,
        data: {
          profile,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}