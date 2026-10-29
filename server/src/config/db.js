import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  '/server/.env',
  '/.env',
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
}

mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    console.warn('\n⚠️ [Database Notice]: MONGODB_URI is not configured with active credentials.');
    console.warn('👉 App is running with an in-memory session database store.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    console.log(`✅ [Database]: MongoDB Atlas connected successfully to host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [Database Notice]: MongoDB Atlas connection failed (${error.message}). Using in-memory store.`);
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
