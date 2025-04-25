// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { IHttpException } from '../interfaces/error.interface';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  error: IHttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
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