import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { getJWTSecret } from '../utils/jwtSecret';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      if (process.env.NODE_ENV !== 'production') {
        let guestUser = (await User.findOne().select('-password')) as IUser | null;
        if (!guestUser) {
          const created = await User.create({
            username: 'demo',
            email: 'demo@eduverse.local',
            password: 'demo123',
          });
          guestUser = (await User.findById(created._id).select('-password')) as IUser;
        }
        req.user = guestUser;
        next();
        return;
      }

      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }

    try {
      const decoded = jwt.verify(
        token,
        getJWTSecret()
      ) as { id: string };

      const foundUser = (await User.findById(decoded.id).select('-password')) as IUser | null;

      if (!foundUser) {
        res.status(401).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      req.user = foundUser;

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};
