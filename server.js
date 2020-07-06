var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser");

const connectDB = require("./config/db");

// Connect Database

connectDB();


//BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// app.use(function(req,res,next){
//    res.locals.currentUser= req.user;
//    next();
// });


app.get('/',(req, res) => {
    res.json({
        status: 'API is Working',
        message: 'Welcome to BookCar!',
    });
});


//Define Routes
app.use("/api/user", require("./routes/users"));
app.use('/api/profile', require("./routes/profiles"));
app.use("/api/cars", require("./routes/cars"));
app.use("/api/bookings", require("./routes/bookings"));



app.listen(process.env.PORT||5000,function(){
    console.log("CarRentalAPI server has Started!");
});