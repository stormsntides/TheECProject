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

// ADMIN BLOG VIEW ROUTES
// INDEX , middleware.isLoggedIn
router.get("/", function(req, res) {
  res.render("admin/index");
});

// SHOW
router.get("/blog/:id", function(req, res){
  console.log("ID: " + req.params.id);
  console.log("Search: " + req.query.search);
  if(req.params.id !== "none"){
    Blogpost.findById(req.params.id, function(err, foundBlogpost){
      if(err || !foundBlogpost){
        console.log(err);
        res.json(null);
      } else {
        res.json(foundBlogpost);
      }
    });
  } else if(req.query.search){
    let term = escapeRegExp(req.query.search).replace(/ +/g, "|");
    let searchOptions = req.query.search === "all" ? {} : {tags: RegExp(term, "i")};

    Blogpost.count(searchOptions, function(err, blogpostCount){
      if(err){
        console.log(err);
        res.json(null);
      } else {
        let page = req.query.page ? parseInt(req.query.page) - 1 : 0;
        let pageSize = req.query.pagesize ? parseInt(req.query.pagesize) : 20;

        let maxPage = Math.ceil(blogpostCount / pageSize);
        let curPage = (page < 0 ? maxPage - 1 : (page >= maxPage ? 0 : page));

        let pageOptions = {skip: curPage * pageSize, limit: pageSize};
        Blogpost.find(searchOptions, null, pageOptions, function(err, foundBlogpost) {
          if(err || !foundBlogpost){
            console.log(err);
            res.json(null);
          } else {
            res.json({pages: {currentPage: curPage + 1, lastPage: maxPage}, count: blogpostCount, results: foundBlogpost});
          }
        });
      }
    });
  } else {
    res.json(null);
  }
});

// CREATE
router.post("/blog/", function(req, res) {
  // expect form data from AJAX POST request and format it properly for the database
  let newBlogpost = formatBlogpost(req.body.blogpost);
  Blogpost.create(newBlogpost, function(err) {
    if (err) {
      console.log(err);
      res.json({message: err});
    } else {
      console.log("Success! \"" + newBlogpost.code + "\" was created!");
      res.json({message: "Success! \"" + newBlogpost.code + "\" was created!"});
    }
  });
});

// UPDATE
router.put("/blog/:id", function(req, res) {
  let updatedBlogpost = formatBlogpost(req.body.blogpost);
  Blogpost.findByIdAndUpdate(req.params.id, updatedBlogpost, function(err, oldBlogpost) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success! \"" + updatedBlogpost.code + "\" (fka: \"" + oldBlogpost.code + "\") was updated!");
    }
  });
  res.json(null);
});

// DESTROY
router.delete("/blog/:id", function(req, res) {
  console.log("Request Body ID: " + req.params.id);
  Blogpost.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Warning! Blogpost deleted!");
    }
    res.json(null);
  });
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function formatBlogpost(blogObj) {
  let fBlog = {
    title: blogObj.title,
    content: {
      summary: blogObj.summary,
      full: blogObj.full
    },
    date: new Date(),
    order: blogObj.order,
    tags: ["all", blogObj.title.replace(" ", "_"), blogObj.order]
  };
  // tags with spaces will have them replaced with underscores
  // required tags are hardcoded above, all other user tags will be appended below
  blogObj.tags.split(",").forEach(function(tag){
    let trimmedTag = tag.trim().replace(" ", "_");
    // for when the user updates a product, make sure no tags are being added doubly
    if(fBlog.tags.indexOf(trimmedTag) < 0){
      fBlog.tags.push(trimmedTag);
    }
  });
  return fBlog;
}

module.exports = router;
