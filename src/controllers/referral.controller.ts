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