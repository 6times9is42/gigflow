import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const body: ErrorResponse = {
      error: { message: err.message, code: err.code },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ErrorResponse = {
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.flatten().fieldErrors,
      },
    };
    res.status(400).json(body);
    return;
  }

  const isDev = config.NODE_ENV === 'development';
  const body: ErrorResponse = {
    error: {
      message: isDev && err instanceof Error ? err.message : 'Internal server error',
      code: 'INTERNAL_ERROR',
      ...(isDev && err instanceof Error ? { details: err.stack } : {}),
    },
  };
  res.status(500).json(body);
}
