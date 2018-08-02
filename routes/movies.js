var express=require("express");
var router=express.Router();
var Movie=require("../models/movie");
var middleware=require("../middleware");

router.get("/", function(req,res){
  
    Movie.find({}, function(err,allMovies){
        if(err){
            console.log(err);
        }else{
             res.render("movies/index", {movies:allMovies, currentUser:req.user});
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function (req,res){
   
    //get data from form
    var name=req.body.name;
    var image=req.body.image;
    var rating=req.body.rating;
    var description=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    }
    //add to movie array
    var newMovie={name: name, image: image, rating:rating, description:description, author:author}
    
    if(name && image && rating && description){
        //create new movie and save to DB
        Movie.create(newMovie,function(err,newlyCreated){
           if(err){
               req.flash("error", "Something wrong. Try again later.")
                res.redirect("back");
           } else{
               req.flash("success", "your review was added successfully!")
               res.redirect("/movies");
           }
        });

    }else{
        req.flash("error", "Please fill all the fields to upload a review.")
        res.redirect("back")
    }
});
        





router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("movies/new", {currentUser:req.user});
})

router.get("/:id", function(req, res) {
    //find the movie with provided ID
    Movie.findById(req.params.id).populate("comments").exec(
        function(err, foundMovie){
        if(err){
            console.log(err);
        }else{
            res.render("movies/show",{movie:foundMovie,currentUser:req.user});
        }
    });
    
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkMovieOwnership, function(req, res) {
   Movie.findById(req.params.id,function(err, foundMovie) {
       res.render("movies/edit", {movie:foundMovie, currentUser:req.user})
   })
    
   
   
});

//UPDATE ROUTE
router.put("/:id",middleware.checkMovieOwnership,function(req,res){
    //find and update the correct movie
    Movie.findByIdAndUpdate(req.params.id,req.body.movie,function(err,updatedData){
        if(err){
            res.redirect("/movies")
        }else{
            req.flash("success", "Your review was successfully updated!")
            res.redirect("/movies/" +req.params.id);
        }
    })
})
,
//DESTROY ROUTE
router.delete("/:id",middleware.checkMovieOwnership, function(req,res){
    Movie.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "your review was deleted successfully!")
            res.redirect("/movies")
        }
    })
})




module.exports=router;