import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import { AppError } from './utils/AppError';

const app: Application = express();

// Security
app.use(helmet());
app.use(cors({ origin: config.CORS_ORIGIN, credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging — skip in test mode to keep output clean
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes — populated in later phases
// app.use('/api/auth', authRoutes);
// app.use('/api/leads', leadsRoutes);

// 404 catch-all — must come after all real routes
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'Route not found', 'NOT_FOUND'));
});

// Centralized error handler — must be last middleware
app.use(errorHandler);

export default app;
