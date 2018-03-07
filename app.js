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
    IP = process.env.IP || "127.0.0.1";

var db_url;
if(process.env.DATABASEURL){
  db_url = process.env.DATABASEURL;
} else {
  var databaseData = require("./local-files/databaseData");
  db_url = databaseData.localURL;
}
mongoose.connect(db_url);

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
});
