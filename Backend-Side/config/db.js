import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("YOUR_MONGO_URL");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;