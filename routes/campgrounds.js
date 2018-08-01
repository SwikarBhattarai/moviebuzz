var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

router.get("/", function(req,res){
  
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
             res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser:req.user});
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function (req,res){
   
    //get data from form
    var name=req.body.name;
    var image=req.body.image;
    var price=req.body.price;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    //add to campground array
    var newCampground={name: name, image: image, price:price, description:description, author:author}
    
    
        //create new campground and save to DB
        Campground.create(newCampground,function(err,newlyCreated){
           if(err){
               req.flash("error", "Something wrong. Try again later.")
                res.redirect("back");
           } else{
               req.flash("success", "your review was added successfully!")
               res.redirect("/campgrounds");
           }
        });
    
   
});





router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new", {currentUser:req.user});
})

router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(
        function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show",{campground:foundCampground,currentUser:req.user});
        }
    });
    
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id,function(err, foundCampground) {
       res.render("campgrounds/edit", {campground:foundCampground, currentUser:req.user})
   })
    
   
   
});

//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedData){
        if(err){
            res.redirect("/campgrounds")
        }else{
            req.flash("success", "Your review was successfully updated!")
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
})
,
//DESTROY ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "your review was deleted successfully!")
            res.redirect("/campgrounds")
        }
    })
})




module.exports=router;