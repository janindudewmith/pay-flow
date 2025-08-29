import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use default connection string if environment variable is not set
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    // Check if URI already includes a database name
    const dbName = uri.includes('mongodb.net/') ? '' : '/pay-flow';

    const connectionString = `${uri}${dbName}`;
    console.log(`Connecting to MongoDB at: ${connectionString}`);

    // Configure Mongoose connection
    await mongoose.connect(connectionString);

    console.log("Database connected successfully");

    // Add event listeners for connection issues
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Full error:", error);

    // Don't exit the process, allow the application to run with degraded functionality
    console.warn("Application running without database connection");
  }
};

export default connectDB;
