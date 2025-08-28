import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Use default connection string if environment variable is not set
    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";

    // Check if URI already includes a database name
    const dbName = uri.includes('mongodb.net/') ? '' : '/pay-flow';

    const connectionString = `${uri}${dbName}`;
    console.log(`Connecting to MongoDB at: ${uri.includes('mongodb.net/') ? 'MongoDB Atlas' : 'Local MongoDB'}`);

    // Configure Mongoose connection options for production
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Configure Mongoose connection
    await mongoose.connect(connectionString, options);

    console.log("Database connected successfully");

    // Add event listeners for connection issues
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful shutdown for local development
    if (process.env.NODE_ENV !== 'production') {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      });
    }

  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Full error:", error);

    // Don't exit the process, allow the application to run with degraded functionality
    console.warn("Application running without database connection");
    
    // In production, you might want to retry the connection
    if (process.env.NODE_ENV === 'production') {
      console.log("Retrying connection in 5 seconds...");
      setTimeout(() => {
        connectDB();
      }, 5000);
    }
  }
};

export default connectDB;
