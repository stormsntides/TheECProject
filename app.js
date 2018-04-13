var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User = require("./models/user");
    // userSeed = require("./local-files/seeds/userSeeds"); // remove in production
    // blogSeed = require("./local-files/seeds/blogSeeds"), // remove in production
    // productSeed = require("./local-files/seeds/productSeeds"); // remove in production

var indexRoutes = require("./routes/index"),
    blogRoutes = require("./routes/blog"),
    aboutRoutes = require("./routes/about"),
    demoRoutes = require("./routes/demo"),
    adminRoutes = require("./routes/admin");

var PORT = process.env.PORT || "8081",
    DATABASEURL = process.env.DATABASEURL || "mongodb://testdata_admin:TheECProject_Data@ds155288.mlab.com:55288/ec_testdata";

mongoose.connect(DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use("/johnnyPublic", express.static(__dirname + "/demos/johnny/public"));
app.use(methodOverride("_method"));
app.use(flash()); //NEW LINE OF CODE 3/28/2018

// userSeed(); // remove in production
// blogSeed(); // remove in production
// productSeed(); // remove in production

// NEW CODE BELOW 3/28/2018
//change the secret to something that can be placed in an environment variable
app.use(require("express-session")({
    secret: process.env.PASSPORTSECRET || "Local Env secret message.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.flashError = req.flash("error");
    res.locals.flashSuccess = req.flash("success");
    res.locals.flashWarning = req.flash("warning");
    next();
});
//NEW CODE ABOVE

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/about", aboutRoutes);
app.use("/demo", demoRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("ECP server is running!");
});
