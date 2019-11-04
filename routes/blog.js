var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", function(req, res){
  Blogpost.find({}, function(err, allBlogposts){
    if(err){
      // unable to retrieve blogposts
      console.log(err);
      res.json({message: err, status: "fail", type: "error"});
    } else {
      // check to see if there is a user logged in, then check to see if admin
      let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
      // render page with isAdmin data and all blogposts sorted
      res.render("blog/index", {
        isAdmin: isAdmin,
        adminNavContext: "blog",
        allowManagePost: false,
        blogposts: allBlogposts.sort(function(a, b){
          return a.order - b.order;
        })
      });
    }
  });
});

// NEW
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  res.render("blog/new", {
    isAdmin: true,
    adminNavContext: "blog",
    allowManagePost: false
  });
});

// CREATE
router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  let newPost = {
    title: req.body.blogpost.title,
    content: req.body.blogpost.content,
    date: new Date(),
    order: req.body.blogpost.order
  };

  Blogpost.create(newPost, function(err){
    if(err){
      console.log(err);
      req.flash("error", "Blog post could not be created. See server logs for details.");
    } else {
      req.flash("success", "New blog post created!");
    }
    res.redirect("/blog");
  });
});

// SHOW
router.get("/:id", function(req, res){
  Blogpost.findById(req.params.id, function(err, foundBlogpost){
    if(err || !foundBlogpost){
      console.log(err);
      req.flash("error", "Invalid blog ID. Could not retrieve blog.");
      res.redirect("/blog");
    } else {
      // check to see if there is a user logged in, then check to see if admin
      let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
      // render page with isAdmin data and found blogpost
      res.render("blog/show", {
        isAdmin: isAdmin,
        adminNavContext: "blog",
        allowManagePost: true,
        blogpost: foundBlogpost
      });
    }
  });
});

// EDIT
router.get("/:id/edit", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Blogpost.findById(req.params.id, function(err, foundBlogpost){
    if(err || !foundBlogpost){
      console.log(err);
      req.flash("error", "Unable to retrieve blog post. See server logs for details.");
      res.redirect("/blog");
    } else {
      res.render("blog/edit", {
        isAdmin: true,
        adminNavContext: "blog",
        allowManagePost: false,
        blogpost: foundBlogpost
      });
    }
  });
});

// UPDATE
router.put("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  let editedPost = {
    title: req.body.blogpost.title,
    content: req.body.blogpost.content,
    order: req.body.blogpost.order
  };

  Blogpost.findByIdAndUpdate(req.params.id, editedPost, function(err, updatedBlogpost){
    if(err){
      console.log(err);
      // res.json({message: err, status: "fail", type: "error"});
      req.flash("error", "Unable to update blog post. See server logs for details.");
    } else {
      // res.json({message: "Updated post \"" + updatedBlogpost.title + "\"!", status: "success", type: "update"});
      req.flash("success", "Updated post \"" + updatedBlogpost.title + "\"!");
    }
    res.redirect("/blog");
  });
});

// DESTROY
router.delete("/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  console.log("Received delete request.");
  Blogpost.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      // res.json({message: err, status: "fail", type: "error"});
      req.flash("error", "Unable to delete blog post. See server logs for details.");
    } else {
      // res.json({message: "Deleted post.", status: "success", type: "delete"});
      req.flash("success", "Deleted post!");
    }
    res.redirect("/blog");
  });
});

module.exports = router;
