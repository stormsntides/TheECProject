var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({
  title: String,
  album: String,
  artist: String,
  producer: String,
  description: String,
  duration: String,
  filename: String,
  contentType: String
});

module.exports = mongoose.model("Song", songSchema);
