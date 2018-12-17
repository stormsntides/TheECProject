var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    passport = require("passport"),
    User = require("../models/user");

router.get("/", function(req, res){
    let userType = "none";
    if(req.user){
      userType = middleware.verifyUserAdminKey(req.user.adminKey) ? "admin" : "user";
    }
    res.render("home", {
      userType: userType
    });
});

module.exports = router;
