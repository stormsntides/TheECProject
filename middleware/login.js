var middlewareObj = {},
    key = process.env.ADMINKEY || "ab57da778ff109d4";

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be an admin to do that!");
    res.redirect("/admin/login");
};

middlewareObj.isAdmin = function(req, res, next){
  if(req.user.adminKey === key){
    return next();
  }
  req.flash("error", "You do not have admin privileges.");
  res.redirect("/admin/info");
};

middlewareObj.verifyUserAdminKey = function(userKey){
  return userKey === key;
}

module.exports = middlewareObj;
