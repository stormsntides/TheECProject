var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    Message = require("../models/message"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  res.redirect("/message");
});

router.get("/stats", async function(req, res){
  let counts = {
    blogs: await Blogpost.estimatedDocumentCount().exec(),
    messages: await Message.estimatedDocumentCount().exec()
  };
  res.json({
    message: "DB contains the following document counts.",
    data: counts
  });
});

module.exports = router;
