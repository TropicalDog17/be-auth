const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo DB connected");
  } catch (err) {
    console.log(err);
    console.log("Unable to connect to Mongo Atlas");
  }
}
module.exports = dbConnect;
