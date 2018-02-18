var express = require("express"),
    router = express.Router();

router.get("/", function(req, res){
    // res.render("code", {lang: ""});
    res.render("code/index");
});

// router.post("/", function(req, res){
//     var lang = {
//         code: req.body.code,
//         html: ernLang.parseCode(req.body.code)
//     }
//     res.render("code", {lang: lang});
// });

module.exports = router;