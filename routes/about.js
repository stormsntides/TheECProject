var express = require("express"),
    router = express.Router(),
    Song = require("../models/song");

router.get("/", function(req, res){
    // res.render("about/index");
    Song.find({contentType: "audio/mpeg"}, function(err, allSongs){
    if(err){
      console.log(err);
      return res.status(404).json({err: err});
    } else if(!allSongs || allSongs.length === 0){
      res.render("about/index", {songs: false});
    } else {
      res.render("about/index", {songs: allSongs});
    }
  });
});

module.exports = router;
