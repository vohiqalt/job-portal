import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGO_URI environment variable in .env.local"
  );
}

// Correctly define the global type for mongoose
declare global {
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

// Initialize the global mongoose object if it doesn't exist
global.mongoose = global.mongoose || { conn: null, promise: null };

async function dbConnect() {
  // If there is already an active connection, return it
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Otherwise, create a new promise for the connection
  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
  }

  // Wait for the promise to resolve and cache the connection
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default dbConnect;
