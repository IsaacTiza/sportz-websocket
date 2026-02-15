import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../config/config.env') });

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    const mongoDBName = process.env.MONGO_DB_NAME;

    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in config.env');
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: mongoDBName,
      connectTimeoutMS: parseInt(process.env.DB_CONNECT_TIMEOUT || 5000),
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.db.databaseName}`);
    
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

export default connectDB;
