var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function(req, res){
  let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
  res.render("home/index", {
    isAdmin: isAdmin,
    adminNavContext: "home"
  });
});

module.exports = router;
