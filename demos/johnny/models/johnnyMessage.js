var mongoose = require("mongoose");

var jcMessageSchema = new mongoose.Schema({
  author: String,
  email: String,
  subject: String,
  message: String,
  date: Date
});

module.exports = mongoose.model("JCMessage", jcMessageSchema);
