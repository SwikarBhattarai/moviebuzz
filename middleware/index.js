//all the middleware goes here

var Movie=require("../models/movie")
var Comment=require("../models/comment")
var middlewareObj={};

middlewareObj.checkMovieOwnership=function(req,res,next){
     if(req.isAuthenticated()){
        //does user own the movie
        Movie.findById(req.params.id,function(err,foundMovie){
            if(err){
                res.redirect("back")
            }else{
                if(foundMovie.author.id.equals(req.user._id)){
                     next();
                }else{
                    res.redirect("back")
                }
               
            }
        });
    }else{
        res.redirect("back")
    }
}

middlewareObj.checkCommentsOwnership=function(req,res,next){
    if(req.isAuthenticated()){
        //does user own the movie
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back")
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                     next();
                }else{
                    res.redirect("back")
                }
               
            }
        });
    }else{
        res.redirect("back")
    }
}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login to add a review.")
    res.redirect("/login");
}




module.exports=middlewareObj;