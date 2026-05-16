import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Target = 'body' | 'query' | 'params';

export function validate(
  schema: ZodSchema,
  target: Target = 'body',
): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      // Pass ZodError to the centralized error handler, which formats it with field details
      next(result.error);
      return;
    }
    // Replace target with parsed + coerced data from Zod.
    // Double-cast via unknown is required because Express's Request type lacks an index signature.
    (req as unknown as Record<string, unknown>)[target] = result.data;
    next();
  };
}
