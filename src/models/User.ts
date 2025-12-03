import { MongoClient } from "mongodb";

// Pastikan MONGODB_URI terisi di file .env.local
const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("❌ MONGODB_URI tidak ditemukan. Pastikan ada di .env.local!");
}

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // Trick untuk menghindari duplikasi client pada Hot Reload Next.js
  // @ts-ignore
  var _mongoClientPromise: Promise<MongoClient>;
}

// Untuk mode development → gunakan global
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// ===========================
// 🔥 Tambahkan bagian ini!!
// ===========================
export async function getUserCollection() {
  const client = await clientPromise;
  const db = client.db("financeApp"); // ← Ganti nama DB jika beda
  return db.collection("users");
}