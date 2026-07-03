import jwt, { SignOptions } from 'jsonwebtoken';
import { getJWTSecret } from './jwtSecret';

export const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id }, getJWTSecret(), options);
};
