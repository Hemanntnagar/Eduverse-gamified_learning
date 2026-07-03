import jwt from 'jsonwebtoken';
import { getJWTSecret } from './jwtSecret';

export const generateToken = (id: string): string => {
  return jwt.sign({ id }, getJWTSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
