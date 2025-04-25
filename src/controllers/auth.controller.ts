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





