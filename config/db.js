const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/authorization";

module.exports = mongoose.connect(url);
