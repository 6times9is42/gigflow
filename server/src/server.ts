import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';

async function main(): Promise<void> {
  await connectDB();

  const server = app.listen(config.PORT, () => {
    console.info(`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
  });

  server.on('error', (err: Error) => {
    console.error('Server error:', err);
    process.exit(1);
  });
}

main().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
