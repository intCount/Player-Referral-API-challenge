import { RequestHandler } from 'express';

export function asHandler<T>(handler: T): RequestHandler {
  return handler as unknown as RequestHandler;
}