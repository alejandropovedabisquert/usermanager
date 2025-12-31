const mongoose = require("mongoose");
const connectionString = process.env.MONGO_URI || "";

async function connectToDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB with Mongoose successfully");
  } catch(error) {
    console.error("Error connecting to MongoDB:", { details: error.message });
  }
}

connectToDatabase();

module.exports = mongoose;