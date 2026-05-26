const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    }
    // Fallback: in-memory MongoDB for local dev
    const { MongoMemoryServer } = require("mongodb-memory-server");
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log("In-memory MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
