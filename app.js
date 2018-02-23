var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    blogSeed = require("./models/seeds/blogSeeds"),
    productSeed = require("./models/seeds/productSeeds");

var indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    codeRoutes = require("./routes/code"),
    productRoutes = require("./routes/product-search");

var db_url = process.env.DATABASEURL || "mongodb://localhost/ecproject";
mongoose.connect(db_url);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// blogSeed();
// productSeed();

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/code", codeRoutes);
app.use("/product", productRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("ECP server is running!");
});