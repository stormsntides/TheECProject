var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    code: String,
    info: {
        name: String,
        manu: String,
        desc: String,
        url: String
    },
    loc: String,
    tags: []
});

module.exports = mongoose.model("Product", productSchema);