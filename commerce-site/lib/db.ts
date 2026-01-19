import { MongoClient } from "mongodb";

let cachedClient: MongoClient | null = null;

export async function connectDB(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    cachedClient = client;
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getDB() {
  const client = await connectDB();
  return client.db("ecommerce");
}
