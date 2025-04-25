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