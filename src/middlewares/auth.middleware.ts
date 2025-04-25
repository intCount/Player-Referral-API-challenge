// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../utils/error.handler';
import { Player } from '../models/player.model';

export interface RequestWithPlayer extends Request {
  player: any;
  headers: {
    authorization?: string;
    origin?: string;
    [key: string]: any;
  };
}

export const authMiddleware = async (req: RequestWithPlayer, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      throw new UnauthorizedException('Invalid authentication token');
    }
    
    const player = await Player.findOne({ id: decoded.id });
    
    if (!player) {
      throw new UnauthorizedException('Player not found');
    }
    
    req.player = player;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedException('Invalid authentication token'));
    } else {
      next(error);
    }
  }
};