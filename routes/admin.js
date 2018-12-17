var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    Song = require("../models/song"),
    Message = require("../models/message"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  res.render("admin/index");
});

router.get("/info", function(req, res){
  let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
  res.render("admin/userInfo", {isAdmin: isAdmin});
});

router.get("/stats", async function(req, res){
  let counts = {
    blogs: await Blogpost.estimatedDocumentCount().exec(),
    songs: await Song.estimatedDocumentCount().exec(),
    mesages: await Message.estimatedDocumentCount().exec()
  };
  res.json({
    message: "DB contains the following document counts.",
    data: counts
  });
});

module.exports = router;
