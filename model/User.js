const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
});
module.exports = mongoose.model.User || mongoose.model("User", userSchema);
