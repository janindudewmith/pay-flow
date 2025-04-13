import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/pay-flow`);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit if DB fails to connect
  }
};

export default connectDB;
