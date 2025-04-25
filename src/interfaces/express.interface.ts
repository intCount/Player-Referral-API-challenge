// src/interfaces/express.interface.ts
import { RequestHandler } from 'express';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export type CustomRequestHandler = RequestHandler<any, any, any, any, { player: any }>;

// Utility type to convert middleware that expects RequestWithPlayer to standard Express middleware
export type RequestWithPlayerHandler = (req: RequestWithPlayer, res: Response, next: Function) => void | Promise<void>;