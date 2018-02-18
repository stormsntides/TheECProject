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
// router.post("/", function(req, res){
//     var blogpost = req.body.blogpost;
//     blogpost.date = new Date();
    
//     Blogpost.create(blogpost, function(err){
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/blog");
//         }
//     });
// });

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