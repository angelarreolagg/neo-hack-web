import mongoose, { type ConnectOptions } from "mongoose";

/**
 * Cached connection interface to prevent multiple MongoDB connections
 * during development (Hot Module Reloading) and ensure type safety.
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/** Global cache to persist the connection across module reloads in development */
declare global {
  var mongooseCache: MongooseConnection | undefined;
}

// Initialize the cache, checking if it already exists to avoid duplication
const cached: MongooseConnection = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

/**
 * Establishes a connection to MongoDB using Mongoose.
 *
 * Uses connection caching to prevent creating multiple connections during
 * development (Next.js hot reload) and to reuse existing connections.
 *
 * @returns A promise that resolves to the Mongoose connection instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If a connection already exists, reuse it
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is already in progress, wait for it
  if (cached.promise) {
    return cached.promise;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI environment variable is not defined. " +
        "Please set it in your .env.local file."
    );
  }

  // Connection options for optimal performance and reliability
  const options: ConnectOptions = {
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // Timeout for server selection
    socketTimeoutMS: 45000, // Socket timeout in milliseconds
  };

  // Create the connection promise and cache it
  cached.promise = mongoose.connect(mongoUri, options).then((mongoose) => {
    // Store the connection in the cache once established
    cached.conn = mongoose;
    cached.promise = null;

    return mongoose;
  });

  return cached.promise;
}
