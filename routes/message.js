var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware/login"),
  Message = require("../models/message");

router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Message.find({}, "author subject message date", function(err, allMessages){
    if(err){
      console.log(err);
    } else {
      res.render("admin/inbox/index", {messages: allMessages.sort(function(a, b){
        return a.date - b.date;
      })});
    }
  });
});

router.get("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Message.findById(req.params.id, function(err, foundMessage){
    if(err || !foundMessage){
        console.log(err);
        req.flash("error", "There was an error retrieving the message. Please review server error logs.");
        res.redirect("/admin/inbox");
      } else {
        res.render("admin/inbox/show", {message: foundMessage});
      }
  });
});

router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  Message.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      req.flash("error", "An error occurred. Please review server error logs.");
    } else {
      req.flash("success", "Message deleted and removed from inbox.");
    }
    res.redirect("/admin/inbox");
  });
});

module.exports = router;
