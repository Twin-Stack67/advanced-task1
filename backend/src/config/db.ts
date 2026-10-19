import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // process.env.MONGO_URI is pulled directly from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${(error as Error).message}`);
    // Exit the process if the database connection fails
    process.exit(1);
  }
};

export default connectDB;