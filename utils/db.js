import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection established");
  } catch (error) {
    console.log(error);
    console.error("Connection Failed");
    process.exit(0);
  }
};

export default connectDB;
