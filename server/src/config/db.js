import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️ [Database Warning]: MONGODB_URI is not configured with real Atlas credentials.');
    console.warn('👉 Please update "server/.env" with your valid MongoDB Atlas connection string.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ [Database]: MongoDB Atlas connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [Database Error]: MongoDB Atlas connection failed: ${error.message}`);
    return false;
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getDbStateName = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};
