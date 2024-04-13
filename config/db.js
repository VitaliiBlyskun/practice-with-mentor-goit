const mongoose = require("mongoose");

async function connectDB(params) {
  try {
    const db = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB is connected, dbName: ${db.connection.name} on port: ${db.connection.port}, on host: ${db.connection.host}`.blue.italic.bold);
  } catch (error) {
    console.log(error.message.red.italic.bold)
    process.exit(1);
  }
}


module.exports = connectDB