import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URL!;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let cachedClient: mongoose.Mongoose | null = null;

async function connectToMongoDB(): Promise<mongoose.Mongoose> {
  if (cachedClient) {
    return cachedClient;
  }

  const options: mongoose.ConnectOptions = {};

  cachedClient = await mongoose.connect(MONGODB_URI, options);
  return cachedClient;
}

export default connectToMongoDB;
