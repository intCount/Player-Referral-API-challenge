// src/interfaces/express.interface.ts
import { RequestHandler } from 'express';

export type CustomRequestHandler = RequestHandler<any, any, any, any, Record<string, any>>;
