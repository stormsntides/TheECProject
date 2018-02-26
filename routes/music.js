var express = require("express"),
    router = express.Router();

router.get("/", function(req, res){
    res.render("music/index");
});

module.exports = router;