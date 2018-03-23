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
    demoRoutes = require("./routes/demo");

var PORT = process.env.PORT || "8081",
    DATABASEURL = process.env.DATABASEURL || "mongodb://testdata_admin:TheECProject_Data@ds155288.mlab.com:55288/ec_testdata";

mongoose.connect(DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use("/howler", express.static(__dirname + "/node_modules/howler/dist"));
app.use(methodOverride("_method"));

// blogSeed();
// productSeed();

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/about", aboutRoutes);
app.use("/demo", demoRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("ECP server is running!");
});
