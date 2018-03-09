var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    blogSeed = require("./models/seeds/blogSeeds"),
    productSeed = require("./models/seeds/productSeeds");

var indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    aboutRoutes = require("./routes/about"),
    codeRoutes = require("./routes/code"),
    productRoutes = require("./routes/product-search"),
    johnnyRoutes = require("./routes/johnny");

var PORT = process.env.PORT || "8081",
    DATABASEURL = process.env.DATABASEURL || "mongodb://testdata_admin:TheECProject_Data@ds155288.mlab.com:55288/ec_testdata";

mongoose.connect(DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// blogSeed();
// productSeed();

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/about", aboutRoutes);
app.use("/code", codeRoutes);
app.use("/product", productRoutes);
app.use("/johnny", johnnyRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("ECP server is running!");
});
