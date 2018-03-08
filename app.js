var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    blogSeed = require("./models/seeds/blogSeeds"),
    productSeed = require("./models/seeds/productSeeds");

var indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    musicRoutes = require("./routes/music"),
    codeRoutes = require("./routes/code"),
    productRoutes = require("./routes/product-search");

var PORT = process.env.PORT || "8081",
    IP = process.env.IP || "127.0.0.1",
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
app.use("/music", musicRoutes);
app.use("/code", codeRoutes);
app.use("/product", productRoutes);

app.listen(PORT, IP, function(){
    console.log("ECP server is running!");
    console.log("Port: " + PORT);
    console.log("IP: " + IP);
    console.log("Database Url: " + DATABASEURL);
});
