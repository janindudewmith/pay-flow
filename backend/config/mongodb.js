import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use default connection string if environment variable is not set
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const dbName = "/pay-flow";

    console.log(`Attempting to connect to MongoDB at: ${uri}${dbName}`);

    // Configure Mongoose connection options
    await mongoose.connect(`${uri}${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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
