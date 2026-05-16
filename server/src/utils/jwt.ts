import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  id: string;
  role: 'admin' | 'sales';
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (
    typeof decoded !== 'object' ||
    decoded === null ||
    typeof (decoded as Record<string, unknown>)['id'] !== 'string' ||
    ((decoded as Record<string, unknown>)['role'] !== 'admin' &&
      (decoded as Record<string, unknown>)['role'] !== 'sales')
  ) {
    throw new Error('Invalid token payload');
  }
  return decoded as JwtPayload;
}
