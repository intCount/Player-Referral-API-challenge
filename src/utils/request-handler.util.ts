// src/utils/request-handler.util.ts
import { RequestHandler } from 'express';
import { RequestWithPlayer } from '../middlewares/auth.middleware';

// This utility function helps with typecasting middleware functions
export function asHandler<T>(handler: T): RequestHandler {
  return handler as unknown as RequestHandler;
}

// Create a utility function specifically for RequestWithPlayer handlers
export function asRequestWithPlayerHandler(handler: (req: RequestWithPlayer, res: any, next: any) => any): RequestHandler {
  return handler as unknown as RequestHandler;
}