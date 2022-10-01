const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  // userId: String,
});

module.exports = mongoose.model("datas", userSchema);
