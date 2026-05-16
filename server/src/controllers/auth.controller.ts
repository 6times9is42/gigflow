import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { registerUser, loginUser } from '../services/auth.service';
import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import type { RegisterInput, LoginInput } from '../validators/auth.schema';

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await registerUser(req.body as RegisterInput);
  res.status(201).json({ data: result });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body as LoginInput);
  res.status(200).json({ data: result });
});

export const getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required', 'UNAUTHORIZED');
  }
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError(404, 'User not found', 'NOT_FOUND');
  }
  res.status(200).json({ data: user });
});
