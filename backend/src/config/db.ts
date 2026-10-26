import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | undefined;

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI environment variable is required');
  }

  if (mongoose.connection.readyState === 1) return;

  if (mongoose.connection.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri).catch((error: unknown) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
};

export default connectDB;