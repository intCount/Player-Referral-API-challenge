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