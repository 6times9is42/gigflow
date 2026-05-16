import { User } from '../models/User.model';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import type { RegisterInput, LoginInput } from '../validators/auth.schema';

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'sales';
  };
  token: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError(409, 'Email already registered', 'DUPLICATE_EMAIL');
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? 'sales',
  });

  const token = signToken({ id: String(user._id), role: user.role });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const valid = await user.comparePassword(input.password);
  if (!valid) {
    throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const token = signToken({ id: String(user._id), role: user.role });

  return {
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
}
