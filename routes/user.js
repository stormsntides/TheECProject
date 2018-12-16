var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    Song = require("../models/song"),
    Message = require("../models/message"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", function(req, res) {
  // no dedicated index page yet; have to think of something
  res.redirect("/user/login");
});

router.get("/login", function(req, res){
  if(req.user){
    req.flash("warning", "You must log out before logging in as a new user.");
    res.redirect("/");
  }
  res.render("user/login", {isAdmin: false});
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    successFlash: "Welcome! You are now logged in.",
    failureRedirect: "/user/login",
    failureFlash: true
  }), function(req, res){}
);

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/");
});

router.get('/register', function(req, res){
  if(req.user){
    req.flash("warning", "You must log out before registering as a new user.");
    res.redirect("/");
  }
  res.render('user/register', {isAdmin: false});
});

router.post('/register', function(req, res){
  User.register(new User({username: req.body.username, adminKey: "0"}), req.body.password, function(err, user){
    if(err){
      req.flash("error", "User " + user.username + " already exists!");
      res.redirect('/user/register');
    }

    passport.authenticate('local')(req, res, function (){
      req.flash("success", "New user " + user.username + " created!");
      res.redirect('/');
    });
  });
});

module.exports = router;
