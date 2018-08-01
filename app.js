var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment")
var flash=require("connect-flash");
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user");
var methodoverride=require("method-override")

var indexRoutes=require("./routes/index")
var commentsRoutes=require("./routes/comments")
var campgroundsRoutes=require("./routes/campgrounds")

//mongodb://swikar:swikar123@ds259351.mlab.com:59351/swikar_yelpcamp
mongoose.connect("mongodb://swikar:swikar123@ds259351.mlab.com:59351/swikar_yelpcamp");



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
app.use("/campgrounds/:id/comments",commentsRoutes)
app.use("/campgrounds",campgroundsRoutes)


app.listen(process.env.PORT, process.env.IP, function(req,res){
    console.log("The Yelpcamp server has started");
});