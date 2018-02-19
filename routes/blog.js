var express = require("express"),
    router = express.Router(),
    Blogpost = require("../models/blogpost");
    
// This is where all of the blog routes will be

// INDEX
router.get("/", function(req, res){
    Blogpost.find({}, function(err, allBlogposts){
        if(err){
            console.log(err);
        } else {
            res.render("blog/index", {blogposts: allBlogposts.sort(function(a, b){
                return a.order - b.order;
            })});
        }
    });
});

// NEW
// router.get("/new", function(req, res){
//     res.render("blog/new");
// });

// CREATE
router.post("/", function(req, res){
    if(req.body.blogpost.other === "3800#1208*"){
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
                res.send(err);
            } else {
                res.send("Received post!");
            }
        });
    } else {
        console.log("Incorrect passcode received. Refusing post.");
        res.send("ERROR! Something went wrong.");
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
// router.get("/:id/edit", function(req, res){
//     Blogpost.findById(req.params.id, function(err, foundBlogpost){
//         if(err || !foundBlogpost){
//             console.log(err);
//         } else {
//             res.render("blog/edit", {blogpost: foundBlogpost});
//         }
//     });
// });

// UPDATE
// router.put("/:id", function(req, res){
//     Blogpost.findByIdAndUpdate(req.params.id, req.body.blogpost, function(err, updatedBlogpost){
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/blog/" + req.params.id);
//         }
//     });
// });

// DESTROY
// router.delete("/:id", function(req, res){
//     Blogpost.findByIdAndRemove(req.params.id, function(err){
//         if(err){
//             console.log(err);
//         }
//         res.redirect("/blog");
//     });
// });

module.exports = router;