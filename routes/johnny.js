var express = require("express"),
    router = express.Router();

router.get("/", function(req, res){
    res.render("johnny/index");
});

module.exports = router;
