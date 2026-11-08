import mongoose from "mongoose";
import dns from "node:dns"
dns.setDefaultResultOrder("ipv4first");
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Database connection failed:", error.message);
    process.exit(1);
  }
};
