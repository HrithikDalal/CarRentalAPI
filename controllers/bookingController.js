var Booking = require("../models/Booking");
const {validationResult} = require('express-validator');
const { all } = require("../routes/users");
const Car = require("../models/Car");



//NEW BOOKING
exports.create =async(req,res)=> {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      try {
          const allBooking = await Booking.find({car : req.params.car_id});
          const newBooking = new Booking({
              user : req.user.id,
              car : req.params.car_id,
              issueDate: req.body.issueDate,
              returnDate: req.body.returnDate
          });
          const activeBooking = allBooking.filter(booking =>{
            return ((newBooking.issueDate >= booking.issueDate && newBooking.issueDate <= booking.returnDate)||(newBooking.returnDate >= booking.issueDate && newBooking.returnDate <= booking.returnDate));
        });
        if(activeBooking.length != 0)
        {
            return res.status(400).json('Car is already booked on these dates.');
        }
        const booking = await newBooking.save();
        res.json(booking);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error'); 
      }
};

//GET ALL YOUR BOOKINGS
exports.view = async(req,res) =>{
    try {
        const allBooking = await Booking.find({user : req.user.id}).sort({ issueDate: -1 });
        res.json(allBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

//GET ACTIVE BOOKINGS
exports.activeBooking = async(req,res)=> {
    try {
        const allBooking = await Booking.find({car : req.params.car_id});
        const activeBooking = allBooking.filter(booking =>{
            const date= booking.returnDate;
            const currDate = Date.now();
            return date.getTime() > currDate;
        });
        if(activeBooking.length === 0)
        {
            return res.status(400).json('Car is already booked on these dates.');
        }
        res.json(activeBooking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
};

//DELETE BOOKING
exports.delete = async(req, res) => {
    try {
        //Remove Booking
        const booking = await Booking.findById(req.params.booking_id);

        // Check user
        if (booking.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
        }

        await booking.remove();

        res.json({ msg: 'Booking Cancelled' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};