import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

// 1. Load the environment variables from the .env file
dotenv.config();

// 2. Connect to the database
connectDB();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});