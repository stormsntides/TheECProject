var mongoose = require("mongoose");
var Product = require("../product");

var data = [{
    code: "DUN_427BJP",
    info: {
        name: "John Petrucci Signature Picks",
        manu: "Dunlop",
        desc: "Bag of JP picks",
        url: ""
    },
    loc: "Y-SGR",
    tags: ["all"]
}, {
    code: "DUN_418R.50",
    info: {
        name: "Tortex Standard Red",
        manu: "Dunlop",
        desc: "Refill bag of red tortex picks",
        url: ""
    },
    loc: "Z-SGR",
    tags: ["all"]
}, {
    code: "DUN_418R.60",
    info: {
        name: "Tortex Standard Orange",
        manu: "Dunlop",
        desc: "Refill bag of orange tortex picks",
        url: ""
    },
    loc: "Z-SGR",
    tags: ["all"]
}, {
    code: "DUN_418R.73",
    info: {
        name: "Tortex Standard Yellow",
        manu: "Dunlop",
        desc: "Refill bag of yellow tortex picks",
        url: ""
    },
    loc: "Z-SGR",
    tags: ["all"]
}, {
    code: "DUN_418R.88",
    info: {
        name: "Tortex Standard Green",
        manu: "Dunlop",
        desc: "Refill bag of green tortex picks",
        url: ""
    },
    loc: "Z-SGR",
    tags: ["all"]
}, {
    code: "DUN_488R1.14",
    info: {
        name: "Tortex Standard Pitch Black",
        manu: "Dunlop",
        desc: "Refill bag of pitch black 1.14 picks",
        url: ""
    },
    loc: "Z-SGR",
    tags: ["all"]
}, {
    code: "DAD_EXL110",
    info: {
        name: "Regular Light Electric Strings",
        manu: "D'Addario",
        desc: "Regular light gauge strings, 10-46.",
        url: ""
    },
    loc: "Room 5",
    tags: ["all"]
}, {
    code: "DAD_EXL115",
    info: {
        name: "Medium Electric Strings",
        manu: "D'Addario",
        desc: "Medium gauge strings, 11-49.",
        url: ""
    },
    loc: "Room 5",
    tags: ["all"]
}, {
    code: "DAD_EXL120",
    info: {
        name: "Extra Light Electric Strings",
        manu: "D'Addario",
        desc: "Extra light gauge strings, 9-42.",
        url: ""
    },
    loc: "Room 5",
    tags: ["all"]
}, {
    code: "DUN_412R.50",
    info: {
        name: "Tortex Sharp Red",
        manu: "Dunlop",
        desc: "Refill bag of red tortex picks",
        url: ""
    },
    loc: "Y-SGR",
    tags: ["all"]
}, {
    code: "DUN_412R.60",
    info: {
        name: "Tortex Sharp Orange",
        manu: "Dunlop",
        desc: "Refill bag of orange tortex picks",
        url: ""
    },
    loc: "Y-SGR",
    tags: ["all"]
}, {
    code: "DUN_412R.73",
    info: {
        name: "Tortex Sharp Yellow",
        manu: "Dunlop",
        desc: "Refill bag of yellow tortex picks",
        url: ""
    },
    loc: "Y-SGR",
    tags: ["all"]
}, {
    code: "DUN_412R.88",
    info: {
        name: "Tortex Sharp Green",
        manu: "Dunlop",
        desc: "Refill bag of green tortex picks",
        url: ""
    },
    loc: "Y-SGR",
    tags: ["all"]
}];

function seedDB(){
    Product.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed product");
        
        data.forEach(function(seed){
            seed.tags.push(seed.code);
            seed.tags.push(seed.info.name.replace(/ +/g, "-"));
            seed.tags.push(seed.info.manu.replace(/ +/g, "-"));
            seed.loc.split(",").forEach(function(locEle){
                seed.tags.push(locEle.trim().replace(/ +/g, "-"));
            });
            Product.create(seed, function(err, product){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a product...");
                }
            });
        });
    });
}

module.exports = seedDB;