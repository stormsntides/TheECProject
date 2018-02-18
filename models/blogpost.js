var mongoose = require("mongoose");

var blogpostSchema = new mongoose.Schema({
    title: String,
    content: {
        summary: String,
        full: String
    },
    date: Date,
    order: Number
});

module.exports = mongoose.model("Blogpost", blogpostSchema);