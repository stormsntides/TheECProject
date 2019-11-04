var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    Message = require("../models/message"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", function(req, res) {
  if(req.user){
    req.flash("warning", "You must log out before logging in as a new user.");
    res.redirect("/");
  }
  let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
  res.render("user/index", {
    isAdmin: isAdmin,
    adminNavContext: "none"
  });
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/",
    successFlash: "Welcome! You are now logged in.",
    failureRedirect: "/user",
    failureFlash: true
  }), function(req, res){}
);

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/");
});

router.post('/register', function(req, res){
  User.register(new User({username: req.body.username, adminKey: "0"}), req.body.password, function(err, user){
    if(err){
      req.flash("error", "User " + user.username + " already exists!");
      res.redirect('/user');
    }

    passport.authenticate('local')(req, res, function (){
      req.flash("success", "New user " + user.username + " created!");
      res.redirect('/');
    });
  });
});

module.exports = router;
