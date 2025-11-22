import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("❌ MONGODB_URI tidak ditemukan. Pastikan ada di .env.local!");
}

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // Trick untuk menghindari duplikasi client pada Hot Reload Next.js
  var _mongoClientPromise: Promise<MongoClient>;
}

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