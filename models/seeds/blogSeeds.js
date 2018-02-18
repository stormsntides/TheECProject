var mongoose = require("mongoose");
var Blogpost = require("../blogpost");

var data = [
        {
            title: "First Post",
            content: {
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor.",
                full: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor et. Vestibulum malesuada nibh laoreet accumsan tincidunt. Proin eget lorem luctus nibh sollicitudin faucibus a eget mauris. Ut bibendum risus vitae felis accumsan condimentum. Ut pretium, turpis vitae lacinia mollis, mauris urna faucibus enim, sed luctus quam libero mattis sapien. Morbi efficitur erat ac ullamcorper pulvinar. Fusce condimentum erat placerat, volutpat leo eget, fermentum dolor."
            },
            date: new Date(),
            order: 1
        },
        {
            title: "Second Post",
            content: {
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor.",
                full: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor et. Vestibulum malesuada nibh laoreet accumsan tincidunt. Proin eget lorem luctus nibh sollicitudin faucibus a eget mauris. Ut bibendum risus vitae felis accumsan condimentum. Ut pretium, turpis vitae lacinia mollis, mauris urna faucibus enim, sed luctus quam libero mattis sapien. Morbi efficitur erat ac ullamcorper pulvinar. Fusce condimentum erat placerat, volutpat leo eget, fermentum dolor."
            },
            date: new Date(),
            order: 2
        },
        {
            title: "Third Post",
            content: {
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor.",
                full: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor et. Vestibulum malesuada nibh laoreet accumsan tincidunt. Proin eget lorem luctus nibh sollicitudin faucibus a eget mauris. Ut bibendum risus vitae felis accumsan condimentum. Ut pretium, turpis vitae lacinia mollis, mauris urna faucibus enim, sed luctus quam libero mattis sapien. Morbi efficitur erat ac ullamcorper pulvinar. Fusce condimentum erat placerat, volutpat leo eget, fermentum dolor."
            },
            date: new Date(),
            order: 3
        },
        {
            title: "Fourth Post",
            content: {
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor.",
                full: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor et. Vestibulum malesuada nibh laoreet accumsan tincidunt. Proin eget lorem luctus nibh sollicitudin faucibus a eget mauris. Ut bibendum risus vitae felis accumsan condimentum. Ut pretium, turpis vitae lacinia mollis, mauris urna faucibus enim, sed luctus quam libero mattis sapien. Morbi efficitur erat ac ullamcorper pulvinar. Fusce condimentum erat placerat, volutpat leo eget, fermentum dolor."
            },
            date: new Date(),
            order: 4
        },
        {
            title: "Fifth Post",
            content: {
                summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor.",
                full: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec convallis velit. Nam commodo nisl nisl, sed blandit lectus tempor et. Vestibulum malesuada nibh laoreet accumsan tincidunt. Proin eget lorem luctus nibh sollicitudin faucibus a eget mauris. Ut bibendum risus vitae felis accumsan condimentum. Ut pretium, turpis vitae lacinia mollis, mauris urna faucibus enim, sed luctus quam libero mattis sapien. Morbi efficitur erat ac ullamcorper pulvinar. Fusce condimentum erat placerat, volutpat leo eget, fermentum dolor."
            },
            date: new Date(),
            order: 5
        }
    ];

function seedDB(){
    Blogpost.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed blogposts");
        
        data.forEach(function(seed){
            Blogpost.create(seed, function(err, blogpost){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added a blogpost...");
                }
            });
        });
    });
}

module.exports = seedDB;