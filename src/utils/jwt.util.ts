// src/utils/jwt.util.ts
import jwt from 'jsonwebtoken';

/**
 * A utility wrapper around jwt.sign to fix TypeScript issues
 */
export const signToken = (
  payload: string | object | Buffer,
  secret: string, 
  options?: jwt.SignOptions
): string => {
  // Using any to bypass TypeScript's strict checking for jwt.sign
  return jwt.sign(payload, secret as any, options as any);
};