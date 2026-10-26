import dotenv from 'dotenv';
import connectDB from './config/db';
import app from './app';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: process.env.DOTENV_CONFIG_PATH ?? '../.env.local' });
}

async function startServer(): Promise<void> {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start API server:', error);
    process.exitCode = 1;
  }
}

// Local development ke liye server start karega
if (process.env.NODE_ENV !== 'production') {
  void startServer();
}