var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Blogpost = require("../models/blogpost"),
    Song = require("../models/song"),
    Message = require("../models/message"),
    passport = require("passport"),
    User = require("../models/user");

// INDEX
router.get("/", middleware.isLoggedIn, middleware.isAdmin, async function(req, res) {
  res.redirect("/admin/inbox");
});

router.get("/login", function(req, res){
  res.render("admin/login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/admin",
    successFlash: "Welcome! You are now logged in.",
    failureRedirect: "/admin/login",
    failureFlash: true
  }), function(req, res){}
);

router.get("/info", function(req, res){
  res.render("admin/newUserInfo");
});

router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "You are now logged out!");
  res.redirect("/");
});

router.get('/register', function(req, res){
  res.render('admin/register');
});

router.post('/register', function(req, res){
  User.register(new User({username: req.body.username, adminKey: "0"}), req.body.password, function(err, user){
    if(err){
      req.flash("error", "User " + user.username + " already exists!");
      res.redirect('/admin/register');
    }

    passport.authenticate('local')(req, res, function (){
      req.flash("success", "New user " + user.username + " created!");
      res.redirect('/');
    });
  });
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

// ADMIN MESSAGE VIEW ROUTES


// ADMIN BLOG VIEW ROUTES
// SHOW
router.get("/blog/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
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
router.post("/blog/", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  // expect form data from AJAX POST request and format it properly for the database
  let newBlogpost = formatBlogpost(req.body.blogpost, true);
  Blogpost.create(newBlogpost, function(err){
    if(err){
      console.log(err);
      res.json({message: err, status: "fail", type: "error"});
    } else {
      res.json({message: "Received post!", status: "success", type: "new"});
    }
  });
});

// UPDATE
router.put("/blog/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  let updatedBlogpost = formatBlogpost(req.body.blogpost, false);
  Blogpost.findByIdAndUpdate(req.params.id, updatedBlogpost, function(err, oldBlogpost){
    if(err){
      console.log(err);
      res.json({message: err, status: "fail", type: "error"});
    } else {
      res.json({message: "Updated post \"" + oldBlogpost.title + "\"!", status: "success", type: "update"});
    }
  });
});

// DESTROY
router.delete("/blog/:id", middleware.isLoggedIn, middleware.isAdmin, function(req, res) {
  console.log("Received delete request.");
  console.log("Request Body ID: " + req.params.id);

  Blogpost.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
      res.json({message: err, status: "fail", type: "error"});
    } else {
      res.json({message: "Deleted post.", status: "success", type: "delete"});
    }
  });
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function formatBlogpost(blogObj, isNewPost) {
  let fBlog = {
    title: blogObj.title,
    content: {
      summary: blogObj.summary,
      full: blogObj.full
    },
    order: blogObj.order
    // tags: ["all", blogObj.title.replace(" ", "_"), blogObj.order]
  };
  if(isNewPost){
    fBlog.date = new Date();
  }
  // tags with spaces will have them replaced with underscores
  // required tags are hardcoded above, all other user tags will be appended below
  /*
  blogObj.tags.split(",").forEach(function(tag){
    let trimmedTag = tag.trim().replace(" ", "_");
    // for when the user updates a product, make sure no tags are being added doubly
    if(fBlog.tags.indexOf(trimmedTag) < 0){
      fBlog.tags.push(trimmedTag);
    }
  });
  */
  return fBlog;
}

module.exports = router;
