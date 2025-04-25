// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../utils/error.handler';
import { Player } from '../models/player.model';

export interface RequestWithPlayer extends Request {
  player?: any;
  ip?: string;
  headers: {
    authorization?: string;
    origin?: string;
    [key: string]: any;
  };
}

export const authMiddleware = async (req: RequestWithPlayer, res: Response, next: NextFunction): Promise<void> => {
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

// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationResult } from 'joi';
import { BadRequestException } from '../utils/error.handler';

export const validationMiddleware = (validator: (data: any) => ValidationResult) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = validator(req.body);
    
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      next(new BadRequestException(message));
    } else {
      next();
    }
  };
};

// src/middlewares/request.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { RequestWithPlayer } from './auth.middleware';

export const requestMiddleware = (req: RequestWithPlayer, res: Response, next: NextFunction): void => {
  // Capture IP address
  req.ip = req.ip || req.connection.remoteAddress || '';
  
  // Capture origin URL
  req.headers.origin = req.headers.origin || req.headers.referer || '';
  
  next();
};

// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { IHttpException } from '../interfaces/error.interface';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  error: IHttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  
  logger.error(`[${status}] ${message}`);
  
  if (process.env.NODE_ENV === 'development') {
    logger.error(error.stack || '');
  }
  
  res.status(status).json({
    status,
    message,
  });
};