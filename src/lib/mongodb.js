import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in your .env.local");
}

/**
 * Global is used to maintain a cached connection in development.
 * This avoids creating multiple connections during HMR (Hot Module Replacement).
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    console.log("Attempting to connect to MongoDB...");

    if (process.env.NODE_ENV === "development") {
        // Nếu đã có kết nối thì không kết nối lại
        if (cached.conn) {
            console.log("Using cached connection");
            return cached.conn;
        }

        // Nếu chưa có promise kết nối, tạo promise mới
        if (!cached.promise) {
            cached.promise = mongoose
                .connect(MONGODB_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                })
                .then((mongooseInstance) => mongooseInstance)
                .catch((e) => {
                    console.error("MongoDB connection failed in development", e);
                    throw new Error("MongoDB connection error in development");
                });
        }

        console.log("Waiting for MongoDB connection...");
        cached.conn = await cached.promise;
        console.log("Successfully connected to MongoDB in development");
        return cached.conn;
    } else {
        // Production: không sử dụng cache
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((mongooseInstance) => mongooseInstance)
            .catch((e) => {
                console.error("MongoDB connection failed in production", e);
                throw new Error("MongoDB connection error in production");
            });

        cached.conn = await cached.promise;
        console.log("Successfully connected to MongoDB in production");
        return cached.conn;
    }
}

export default dbConnect;
