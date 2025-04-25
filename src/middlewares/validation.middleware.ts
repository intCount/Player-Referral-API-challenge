// src/middlewares/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ValidationResult } from 'joi';
import { BadRequestException } from '../utils/error.handler';

export const validationMiddleware = (validator: (data: any) => ValidationResult) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error } = validator(req.body);
    
    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      next(new BadRequestException(message));
    } else {
      next();
    }
  };
};