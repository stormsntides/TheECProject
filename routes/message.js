var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware/login"),
  Message = require("../models/message");

// INDEX
router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Message.find({}, function(err, allMessages){
    if(err){
      console.log(err);
    } else {
      res.render("message/index", {
        isAdmin: true,
        adminNavContext: "message",
        allowManageMessage: false,
        messages: allMessages.sort(function(a, b){
          return a.date - b.date;
        })
      });
    }
  });
});

// NEW
router.get("/new", function(req, res){
  let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
  res.render("message/new", {
    isAdmin: isAdmin,
    adminNavContext: "message",
    allowManageMessage: false
  });
});

// SHOW
router.get("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Message.findById(req.params.id, function(err, foundMessage){
    if(err || !foundMessage){
        console.log(err);
        req.flash("error", "There was an error retrieving the message. Please review server error logs.");
        res.redirect("/message");
      } else {
        res.render("message/show", {
          isAdmin: true,
          adminNavContext: "message",
          allowManageMessage: true,
          message: foundMessage
        });
      }
  });
});

// CREATE
router.post("/", function(req, res){
  let message = req.body.message;
  message.date = new Date();
  message.read = false;
  Message.create(message, function(err){
    if(err){
      console.log(err);
      req.flash("error", "There was an error sending this message.");
    } else {
      req.flash("success", "Message \"" + message.subject + "\" sent!");
    }
    res.redirect("/");
  });
});

// UPDATE
router.put("/:id&:markAs", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  let isRead = req.params.markAs === "read";
  Message.findByIdAndUpdate(req.params.id, {read: isRead}, function(err, updatedBlogpost){
    if(err){
      console.log(err);
      req.flash("error", "Unable to update message read status. See server logs for details.");
    }/* else {
      req.flash("success", "Message marked as " + req.params.markAs + ".");
    }*/
    if(isRead){
      res.redirect("/message/" + req.params.id);
    } else {
      res.redirect("/message");
    }
  });
});

// DELETE
router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  Message.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      req.flash("error", "An error occurred. Please review server error logs.");
    } else {
      req.flash("success", "Message deleted and removed from inbox.");
    }
    res.redirect("/message");
  });
});

module.exports = router;
