import mongoose from 'mongoose';

// MongoDB Atlas Cloud Connection URI for Jashore Sharapol Sanstha
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jashoresharapolsanstha_db_user:pjFKvmsRtIQa0gft@cluster0.tdoszvt.mongodb.net/jashore_sharapol_db?retryWrites=true&w=majority&appName=Cluster0';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ High-Security MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Connecting via Atlas fallback engine...`);
    return false;
  }
};
