var mongoose = require("mongoose");

var blogpostSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: Date,
    order: Number
});

module.exports = mongoose.model("Blogpost", blogpostSchema);
