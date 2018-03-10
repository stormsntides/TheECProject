var express = require("express"),
  router = express.Router(),
  Product = require("../models/product");

// CODE ROUTES
router.get("/code/", function(req, res){
    res.render("code/index");
});

// JOHNNY ROUTES
router.get("/johnny/", function(req, res){
    res.render("johnny/index");
});

// PRODUCT SEARCH ROUTES
// INDEX
router.get("/product/", function(req, res) {
  res.render("productSearch/index");
});

// SHOW
router.get("/product/:id", function(req, res){
  console.log("ID: " + req.params.id);
  console.log("Search: " + req.query.search);
  if(req.params.id !== "none"){
    Product.findById(req.params.id, function(err, foundProduct){
      if(err || !foundProduct){
        console.log(err);
        res.json(null);
      } else {
        res.json(foundProduct);
      }
    });
  } else if(req.query.search){
    let term = escapeRegExp(req.query.search).replace(/ +/g, "|");
    Product.count({tags: RegExp(term, "i")}, function(err, productCount){
      if(err){
        console.log(err);
        res.json(null);
      } else {
        let page = req.query.page ? parseInt(req.query.page) - 1 : 0;
        let pageSize = req.query.pagesize ? parseInt(req.query.pagesize) : 20;

        let maxPage = Math.ceil(productCount / pageSize);
        let curPage = (page < 0 ? maxPage - 1 : (page >= maxPage ? 0 : page));

        let options = {skip: curPage * pageSize, limit: pageSize};
        Product.find({tags: RegExp(term, "i")}, null, options, function(err, foundProducts) {
          if(err || !foundProducts){
            console.log(err);
            res.json(null);
          } else {
            res.json({pages: {currentPage: curPage + 1, lastPage: maxPage}, count: productCount, results: foundProducts});
          }
        });
      }
    });
  } else {
    res.json(null);
  }
});

// CREATE
router.post("/product/", function(req, res) {
  // keep database load reasonable for demo purposes
  Product.count({}, function(err, total){
    if(err){
      console.log(err);
      res.json({message: err});
    } else if(total < 100) {
      // expect form data from AJAX POST request and format it properly for the database
      let newProduct = formatProduct(req.body.product);
      Product.create(newProduct, function(err) {
        if (err) {
          console.log(err);
          res.json({message: err});
        } else {
          console.log("Success! \"" + newProduct.code + "\" was created!");
          res.json({message: "Success! \"" + newProduct.code + "\" was created!"});
        }
      });
    } else {
      console.log("Max product amount has been reached!");
      res.json({message: "Max product amount has been reached!"});
    }
  });
});

// UPDATE
router.put("/product/:id", function(req, res) {
  let updatedProduct = formatProduct(req.body.product);
  Product.findByIdAndUpdate(req.params.id, updatedProduct, function(err, oldProduct) {
    if (err) {
      console.log(err);
    } else {
      console.log("Success! \"" + updatedProduct.code + "\" (fka: \"" + oldProduct.code + "\") was updated!");
    }
  });
  res.json(null);
});

// DESTROY
router.delete("/product/:id", function(req, res) {
  console.log("Request Body ID: " + req.params.id);
  Product.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Warning! Product deleted!");
    }
    res.json(null);
  });
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function formatProduct(pObj) {
  let fProduct = {
    code: pObj.code,
    info: {
      name: pObj.name,
      manu: pObj.manu,
      desc: pObj.desc
    },
    loc: pObj.loc,
    tags: ["all", pObj.code, pObj.name.replace(/ +/g, "-"), pObj.manu.replace(/ +/g, "-")]
  };
  // tags with spaces will have them replaced with dashes
  // certain locations may have commas, split them up into separate tags
  pObj.loc.split(",").forEach(function(locEle){
    fProduct.tags.push(locEle.trim().replace(/ +/g, "-"));
  });
  // required tags are hardcoded above, all other user tags will be appended below
  pObj.tags.split(",").forEach(function(tag){
    let trimmedTag = tag.trim();
    // for when the user updates a product, make sure no tags are being added doubly
    if(fProduct.tags.indexOf(trimmedTag) < 0){
      fProduct.tags.push(trimmedTag);
    }
  });
  return fProduct;
}

module.exports = router;
