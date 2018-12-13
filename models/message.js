var mongoose = require("mongoose");

var messageSchema = new mongoose.Schema({
  author: String,
  email: String,
  subject: String,
  message: String,
  date: Date,
  read: Boolean
});

module.exports = mongoose.model("Message", messageSchema);
