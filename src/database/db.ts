import mongoose from "mongoose";

export const connectDatabase = async () => {
  console.log("Waiting for database connection");
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

