var express=require("express");
var router=express.Router();
var passport=require("passport");
var User=require("../models/user");

router.get("/", function(req,res){
    res.render("landing",{currentUser:req.user})
});





//AUTH ROUTES
router.get("/register", function(req,res){
    res.render('register');
})

router.post("/register", function(req,res){
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            req.flash("success", "Welcome to Movie Buzz "+user.username)
            res.redirect("/movies");
        });
    });
});

//show login form

router.get("/login",function(req,res){
    
    res.render("login")
});

router.post("/login",passport.authenticate("local",
{
    successRedirect:"/movies",
    failureRedirect:"/login",
    failureFlash:true,
    
}), function(req,res){

});

//LOGOUT ROUTE
router.get("/logout", function(req,res){
    req.flash("success","Logout successful!")
    req.logout();
    res.redirect("/movies");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;