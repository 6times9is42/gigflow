import mongoose from 'mongoose';
import { config } from './env';

export async function connectDB(): Promise<void> {
  mongoose.connection.on('error', (err: Error) => {
    console.error('MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(config.MONGODB_URI);
    console.info('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err instanceof Error ? err.message : 'Unknown error');
    process.exit(1);
  }
}
