import express from 'express';
import type { Request, Response, NextFunction } from 'express-serve-static-core';
import cors from 'cors';
import connectDB from './config/db'; // 1. Import database connection
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import companyRoutes from './routes/company.routes';

const app = express();

// 2. Global Database Middleware
// Ensures MongoDB connects before any route handles a request
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).json({ message: 'Internal server error: Database connection failed' });
  }
});

app.use(
  cors({
    origin: (origin, callback) => {
      const configuredOrigins = (process.env.CORS_ORIGINS ?? '')
        .split(',')
        .map((allowedOrigin) => allowedOrigin.trim())
        .filter(Boolean);
      const localOrigins =
        process.env.NODE_ENV === 'production'
          ? []
          : ['http://localhost:3000', 'http://localhost:3001'];
      const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);

      callback(null, !origin || allowedOrigins.has(origin));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/company', companyRoutes);

export default app;
