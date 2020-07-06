const express = require("express");
const router = express.Router({mergeParams: true});
const auth = require("../middleware/auth");
const isAdmin = require('../middleware/isAdmin');
const checkObjectId = require("../middleware/checkObjectId");
const {check} = require('express-validator');

const booking = require("../controllers/bookingController.js");


// @route    POST /api/bookings
// @desc     Create a new booking
// @access   Private
router.post('/:car_id',[auth,checkObjectId('car_id'),[
    check(
        'issueDate',
        'Issue Date is Required and it needs to be in the range of 15 days from tomorrow.'
    ).not().isEmpty().custom( value  => {
        const d = new Date(value);
        const bookTime = d.getTime();
        const currTime = Date.now();
        const allowedTime = currTime + ((24*60*60 + 1) * 1000*15);
        return (currTime < bookTime)&&(bookTime < allowedTime);
    }),
    check(
        'returnDate',
        'Return Date is Required and booking period cannot be greater than 15 days.'
    ).not().isEmpty().custom((value, { req }) => {
        const d = new Date(value);
        const rTime=d.getTime();
        const iTime=new Date(req.body.issueDate).getTime();
        const allowedTime = iTime + ((24*60*60 + 1) * 1000*15);
        return (iTime < rTime)&&(rTime < allowedTime);
    })
]],booking.create);

//@route Get /api/bookings
//@desc Get your bookings
//@sccess Private
router.get('/',auth,booking.view);


// @route    Get /api/bookings
// @desc     Get all active bookings of a car
// @access   Admin Only
router.get('/:car_id/active',[isAdmin, checkObjectId('car_id')],booking.activeBooking);


// @route    DELETE /api/bookings
// @desc     Delete bookings
// @access   Private
router.delete('/:booking_id', [auth, checkObjectId('booking_id')], booking.delete);


module.exports=router;