var express = require("express"),
  router = express.Router(),
  passport = require("passport"),
  middleware = require("../middleware/login"),
  mongoose = require("mongoose"),
  path = require("path"),
  crypto = require("crypto"),
  multer = require("multer"),
  GridFsStorage = require("multer-gridfs-storage"),
  Grid = require("gridfs-stream"),
  Song = require("../models/song"),
  User = require("../models/user");

// consider creating an audio only database
const DATABASEURL = process.env.AUDIO_DATABASEURL || "mongodb://testdata_admin:TheECProject_Data@ds155288.mlab.com:55288/ec_testdata";
const conn = mongoose.createConnection(DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true});

let gfs;
conn.once("open", function(){
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("audio");
});

const storage = new GridFsStorage({
  url: DATABASEURL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(4, (err, buf) => {
        if(err){
          return reject(err);
        }
        const filename = buf.toString("hex") + "_" + file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "audio"
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage: storage });

router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Song.find({}, function(err, allSongs){
    if(err){
      console.log(err);
      return res.status(404).json({err: err});
    } else if(!allSongs || allSongs.length === 0){
      res.render("audio/index", {
        isAdmin: true,
        adminNavContext: "audio",
        allowManageAudio: true,
        files: false
      });
    } else {
      gfs.files.find().toArray(function(err, files){
        if(err){
          console.log(err);
          return res.status(404).json({err: err});
        } else if(!files || files.length === 0){
          res.render("audio/index", {
            isAdmin: true,
            adminNavContext: "audio",
            allowManageAudio: true,
            files: false
          });
        } else {
          files.map(function(file){
            file.isAudio = (file.contentType === "audio/mpeg");
            file.songInfo = findObj(allSongs, "filename", file.filename);
          });
          res.render("audio/index", {
            isAdmin: true,
            adminNavContext: "audio",
            allowManageAudio: true,
            files: files
          });
        }
      });
    }
  });
});

router.post("/upload", middleware.isLoggedIn, middleware.isAdmin, upload.single("upload"), function(req, res){
  let newSong = req.body.song;
  newSong.filename = req.file.filename;
  newSong.contentType = req.file.contentType;
  Song.create(newSong, function(err){
    if(err){
      console.log(err);
      req.flash("error", "There was an error uploading the song. Please review server error logs.");
    } else {
      req.flash("success", "\"" + newSong.title + "\" uploaded successfully!");
    }
    res.redirect("/audio");
  });
});


// file api
router.get("/files", function(req, res){
  gfs.files.find().toArray(function(err, files){
    if(!files || files.length === 0){
      return res.status(404).json({err: "No files exist"});
    }
    return res.json(files);
  });
});

router.get("/files/:filename", function(req, res){
  gfs.files.findOne({filename: req.params.filename}, function(err, file){
    if(!file || file.length === 0){
      return res.status(404).json({err: "No file exists"});
    }
    return res.json(file);
  });
});

router.put("/files/:song_id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Song.findByIdAndUpdate(req.params.song_id, req.body.song, function(err, oldSong){
    if(err){
      console.log(err);
      req.flash("error", "There was an error updating the song. Please review server error logs.");
    } else {
      req.flash("success", "\"" + req.body.song.title + "\" updated successfully!");
    }
    res.redirect("/audio");
  });
});

router.delete("/files/:song_id", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  Song.findByIdAndRemove(req.params.song_id, function(err, removedSong){
    if(err){
      console.log(err);
      req.flash("error", "There was an error deleting the song. Please review server error logs.");
      res.redirect("/audio");
    } else {
      gfs.remove({filename: removedSong.filename, root: "audio"}, function(err, gridStore){
        if(err){
          return res.status(404).json({err: err});
        }
        req.flash("success", "\"" + removedSong.title + "\" deleted!");
        res.redirect("/audio");
      });
    }
  });
});

router.get("/songs", function(req, res){
  Song.find({}, function(err, allSongs){
    if(err){
      return res.status(404).json({err: err});
    } else if(!allSongs || allSongs.length === 0){
      return res.status(404).json({err: "No songs exist"});
    } else {
      gfs.files.find({contentType: "audio/mpeg"}).toArray(function(err, files){
        if(err){
          return res.status(404).json({err: err});
        } else if(!files || files.length === 0){
          return res.status(404).json({err: "No songs exist; This error should never happen"});
        } else {
          files.map(function(file){
            file.songInfo = findObj(allSongs, "filename", file.filename);
          });
          return res.json(files);
        }
      });
    }
  });
});

router.get("/stream/:filename", function(req, res){
  gfs.files.findOne({filename: req.params.filename}, function(err, file){
    if(err){
      return res.status(404).json({err: err});
    } else if(!file || file.length === 0){
      return res.status(404).json({err: "No such file exists"});
    }

    if(file.contentType === "audio/mpeg"){
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.status(404).json({err: "Not an audio file"});
    }
  });
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function findObj(objArr, propName, matchString){
  for(let i = 0; i < objArr.length; i++){
    let obj = objArr[i];
    if(obj[propName] === matchString){
      return obj;
    }
  }
  return undefined;
}

module.exports = router;
