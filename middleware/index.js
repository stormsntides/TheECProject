var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be an admin to do that!");
    res.redirect("/admin/login");
};

module.exports = middlewareObj;
