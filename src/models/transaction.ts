import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri || "");

let cachedDb: any = null;

// Koneksi dan ambil collection
export async function getTransactionCollection() {
  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  // Gunakan cache jika sudah connect
  if (cachedDb) {
    return cachedDb.collection("transactions");
  }

  try {
    await client.connect();
    const db = client.db("Keuanganku"); // Ganti sesuai nama DB
    cachedDb = db;

    return db.collection("transactions");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}