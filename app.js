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
    scheduleRoutes = require("./routes/schedule"),
    adminRoutes = require("./routes/admin"),
    audioRoutes = require("./routes/audio"),
    messageRoutes = require("./routes/message"),
    userRoutes = require("./routes/user");

var PORT = process.env.PORT || "8081",
    DATABASEURL = process.env.DATABASEURL || "mongodb://testdata_admin:TheECProject_Data@ds155288.mlab.com:55288/ec_testdata";

mongoose.connect(DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// userSeed(); // remove in production
// blogSeed(); // remove in production
// productSeed(); // remove in production

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

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/admin", adminRoutes);
app.use("/audio", audioRoutes);
app.use("/message", messageRoutes);
app.use("/user", userRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("ECP server is running! Use localhost:8081 to access during development.");
});
