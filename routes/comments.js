var express=require("express");
var router=express.Router({mergeParams:true});
var Movie=require("../models/movie");
var Comment=require("..//models/comment");
var middleware=require("../middleware")

//comments new
router.get("/new", middleware.isLoggedIn, function(req,res){
    //find movie by id
    Movie.findById(req.params.id, function(err,movie){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {movie:movie});
        }
    })
    
});

//comments use
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup movie using ID
    Movie.findById(req.params.id, function(err, movie) {
        if(err){
            console.log(err)
            res.redirect("/movies")
        }else{
            if(req.body.text){
                Comment.create(req.body.comment,function(err,comment){
                if(err){
                     req.flash("error","Something went wrong. Try again later.")
                    res.redirect("back")
                }else{
                    //add username and id to comment
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    //save comment
                    comment.save();
                    movie.comments.push(comment);
                    movie.save();
                    res.redirect("/movies/" +movie._id);
                }
            }) ;
            }else{
                req.flash("error", "Comment cannot be empty!")
                res.redirect("back");
            }
    
                
           
        }
    })
           
})

//EDIT ROUTE FOR COMMENT

router.get("/:comment_id/edit", middleware.checkCommentsOwnership,function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
              res.render("comments/edit", {movie_id:req.params.id, comment:foundComment,currentUser:req.user})
        }
    })
  
});

//UPDATE ROUTE FOR COMMENT
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/movies/" +req.params.id)
        }
    });
});

//DESTROY ROUTE FOR COMMENT

router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req,res){
    //findbyIdandRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/movies/"+req.params.id);
        }
    });
});

module.exports=router;