const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://Bekzod:6862442@cluster0.qn6t2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, );
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
