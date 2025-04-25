// src/interfaces/express.interface.ts
import { RequestHandler } from 'express';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

export type CustomRequestHandler = RequestHandler<any, any, any, any, { player: any }>;