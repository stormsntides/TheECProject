var express = require("express"),
    router = express.Router(),
    middleware = require("../middleware/login"),
    Song = require("../models/song");

router.get("/", function(req, res){
    // res.render("about/index");
    // check to see if there is a user logged in, then check to see if admin
    let isAdmin = req.user ? middleware.verifyUserAdminKey(req.user.adminKey) : false;
    // find all songs and render
    Song.find({contentType: "audio/mpeg"}, function(err, allSongs){
    if(err){
      console.log(err);
      return res.status(404).json({err: err});
    } else if(!allSongs || allSongs.length === 0){
      res.render("about/index", {
        isAdmin: isAdmin,
        adminNavContext: "audio",
        allowManageAudio: false,
        songs: false
      });
    } else {
      res.render("about/index", {
        isAdmin: isAdmin,
        adminNavContext: "audio",
        allowManageAudio: false,
        songs: allSongs
      });
    }
  });
});

module.exports = router;
