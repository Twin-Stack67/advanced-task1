import type { Request, Response } from 'express';
import app from '../backend/src/app';
import connectDB from '../backend/src/config/db';

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(503).json({ message: 'Database unavailable' });
  }

  return app(req, res);
}
