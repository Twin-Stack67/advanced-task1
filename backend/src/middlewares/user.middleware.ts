import { Request, Response, NextFunction } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { UserRole } from '../models/User.model';

export const validateUserId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: 'Invalid User ID format' });
  }

  next();
};

export const validateUserPayload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, role, password } = req.body;

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email as string)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
  }

  if (role && !Object.values(UserRole).includes(role as UserRole)) {
    return res.status(400).json({
      message: `Invalid role. Allowed roles are: ${Object.values(UserRole).join(', ')}`,
    });
  }

  if (password && (password as string).length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};