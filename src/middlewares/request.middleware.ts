// src/middlewares/request.middleware.ts
import { NextFunction, Response } from 'express';
import { RequestWithPlayer } from './auth.middleware';

export const requestMiddleware = (req: RequestWithPlayer, _res: Response, next: NextFunction): void => {
  // Store client IP in a custom property instead of modifying read-only req.ip
  const clientIp = req.ip || req.connection.remoteAddress || '';
  
  // Safely access req object properties without modifying read-only properties
  Object.defineProperty(req, 'clientIp', {
    value: clientIp,
    writable: true,
    configurable: true
  });
  
  // Capture origin URL
  req.headers.origin = req.headers.origin || req.headers.referer || '';
  
  next();
};