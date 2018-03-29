var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/index"),
    Blogpost = require("../models/blogpost"),
    passport = require("passport"),
    User = require("../models/user");

router.get("/login", function(req, res){
    res.render("admin/login");
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/admin",
        failureRedirect: "/admin/login"
    }), function(req, res){}
);

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You are now logged out!");
    res.redirect("/");
});

// INDEX
router.get("/", middleware.isLoggedIn, function(req, res){
    // Blogpost.find({}, function(err, allBlogposts){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.render("blog/index", {blogposts: allBlogposts.sort(function(a, b){
    //             return a.order - b.order;
    //         })});
    //     }
    // });
    res.send("Admin root path.");
});

// NEW
router.get("/new", function(req, res){
    res.render("../local-files/new");
});

// CREATE
router.post("/", function(req, res){
  // console.log(req.body);
    if(req.body.blogpost.other === blog_key){
        console.log("Correct passcode.");
        let newPost = {
            title: req.body.blogpost.title,
            content: {
              summary: req.body.blogpost.summary,
              full: req.body.blogpost.full
            },
            date: new Date(),
            order: req.body.blogpost.order
        };

        console.log("New Blogpost received!");
        console.log(newPost);

        Blogpost.create(newPost, function(err){
            if(err){
                console.log(err);
                res.json({message: err, status: "fail", type: "error"});
            } else {
                res.json({message: "Received post!", status: "success", type: "new"});
            }
        });
    } else {
        console.log("Incorrect passcode received. Refusing post.");
        res.json({message: "ERROR! Something went wrong.", status: "fail", type: "error"});
    }
});

// SHOW
router.get("/:id", function(req, res){
    Blogpost.findById(req.params.id, function(err, foundBlogpost){
        if(err || !foundBlogpost){
            console.log(err);
        } else {
            res.render("blog/show", {blogpost: foundBlogpost});
        }
    });
});

// EDIT
router.get("/:id/edit", function(req, res){
    Blogpost.findById(req.params.id, function(err, foundBlogpost){
        if(err || !foundBlogpost){
            console.log(err);
        } else {
            res.render("../local-files/edit", {blogpost: foundBlogpost});
        }
    });
});

// UPDATE
router.put("/:id", function(req, res){
  if(req.body.blogpost.other === blog_key){
    console.log("Correct passcode.");
    let editedPost = {
        title: req.body.blogpost.title,
        content: {
          summary: req.body.blogpost.summary,
          full: req.body.blogpost.full
        },
        order: req.body.blogpost.order
    };

    console.log("Edited Blogpost received!");
    console.log(editedPost);

    Blogpost.findByIdAndUpdate(req.params.id, editedPost, function(err, updatedBlogpost){
        if(err){
            console.log(err);
            res.json({message: err, status: "fail", type: "error"});
        } else {
            res.json({message: "Updated post \"" + updatedBlogpost.title + "\"!", status: "success", type: "update"});
        }
    });
  } else {
      console.log("Incorrect passcode received. Refusing post.");
      res.json({message: "ERROR! Something went wrong.", status: "fail", type: "error"});
  }
});

// DESTROY
router.delete("/:id", function(req, res){
  console.log("Received delete request.");
    Blogpost.findByIdAndRemove(req.params.id, function(err){
      if(err){
          console.log(err);
          res.json({message: err, status: "fail", type: "error"});
      } else {
          res.json({message: "Deleted post.", status: "success", type: "delete"});
      }
    });
});

module.exports = router;
