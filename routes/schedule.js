var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function(req, res){
  // check to see if there is a user logged in, then check to see if admin
  let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
  res.render("schedule/index", {
    isAdmin: isAdmin,
    adminNavContext: "schedule"
  });
});

module.exports = router;
