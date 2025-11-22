// src/lib/mongodb.ts
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');  // Pastikan URI sudah ada

export const connectToDatabase = async () => {
  // Tidak perlu mengecek isConnected, cukup melakukan connect
  await client.connect();
  const db = client.db(process.env.DB_NAME || '');  // Pilih database
  return db;
};