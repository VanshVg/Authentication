const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/authentication";

module.exports = mongoose.connect(url);
