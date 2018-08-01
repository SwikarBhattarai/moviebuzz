//all the middleware goes here

var Campground=require("../models/campground")
var Comment=require("../models/comment")
var middlewareObj={};

middlewareObj.checkCampgroundOwnership=function(req,res,next){
     if(req.isAuthenticated()){
        //does user own the campground
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back")
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
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
        //does user own the campground
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