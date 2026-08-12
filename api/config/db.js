import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jashoresharapolsanstha_db_user:pjFKvmsRtIQa0gft@cluster0.tdoszvt.mongodb.net/jashore_sharapol_db?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB Atlas directly: ${error.message}. Using fallback in-memory store engine for full functionality.`);
    return false;
  }
};
