var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Movie=require("./models/movie");
var Comment=require("./models/comment")
var flash=require("connect-flash");
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodoverride=require("method-override")
app.locals.moment=require("moment");

var indexRoutes=require("./routes/index")
var commentsRoutes=require("./routes/comments")
var moviesRoutes=require("./routes/movies")

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/movie_buzz")


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodoverride("_method"));
app.use(flash());




//seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: 'Secret Page',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success")
    next();
});

app.use(indexRoutes)
app.use("/movies/:id/comments",commentsRoutes)
app.use("/movies",moviesRoutes)


app.listen(process.env.PORT, process.env.IP, function(req,res){
    console.log("The Movie Buzz server has started");
});