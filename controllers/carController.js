const User = require('../models/User');
const Car = require("../models/Car");
const Booking = require("../models/Booking");
const {validationResult} = require('express-validator');


//ADD NEW CAR
exports.create = async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    try {

        const user = await User.findById(req.user.id).select('-password');

        const newCar = new Car({
            user: req.user.id,
            registrationNumber : req.body.registrationNumber,
            company : req.body.company,
            model : req.body.model,
            type : req.body.type,
            seatingCapacity : req.body.seatingCapacity,
            rent : req.body.rent,
        });

        const car = await newCar.save();

        res.json(car);  
    } catch (err) {
        console.error(err.message);
      res.status(500).send('Server Error');  
    }
};



//SHOW ALL CARS
exports.index=async(req,res) => {
    try {
    const cars = await Car.find().sort({date : -1});
    res.json(cars);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

//Filter Cars
//filter by company,model,type,seatingCapacity,rent
exports.filter=async(req,res) => {
    try {
        const cars = await Car.find(req.body).sort({rent : -1});
        res.json(cars);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

//Get car by Id
exports.view = async(req, res) =>  {
    try {
        const car = await Car.findById(req.params.car_id);
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
};




//UPDATE CAR
exports.update = async(req, res) => {
    try {

         //Check for active bookings
         const allBooking = await Booking.find({car : req.params.car_id});
         const activeBooking = allBooking.filter(booking =>{
             const date= booking.returnDate;
             const currDate = Date.now();
             return date.getTime() > currDate;
         });
         if(activeBooking.length != 0)
         {
             return res.status(400).json('You can not update car with active bookings.');
         }

        const car= await Car.findByIdAndUpdate(req.params.car_id,req.body,{new: true});
        res.json(car);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  };
  
  
  
//DELETE CAR
exports.delete = async(req, res) => {
    try {
        //Remove Car
        const car = await Car.findById(req.params.car_id);
        //Check for active bookings
        const allBooking = await Booking.find({car : req.params.car_id});
        const activeBooking = allBooking.filter(booking =>{
            const date= booking.returnDate;
            const currDate = Date.now();
            return date.getTime() > currDate;
        });
        if(activeBooking.length != 0)
        {
            return res.status(400).json('You can not delete car with active bookings.');
        }

        await car.remove();
        res.json({ msg: 'Car deleted' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
