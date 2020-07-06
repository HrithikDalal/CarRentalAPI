const express = require("express");
const router = express.Router();
const {check} = require('express-validator');
const isAdmin = require('../middleware/isAdmin');
const checkObjectId = require('../middleware/checkObjectId');
const car = require('../controllers/carController.js');

//@route POST api/cars
//@desc Add car
//access Admin Only
router.post("/",[ isAdmin, [
    check(
        'registrationNumber',
        'Car registration number is required'
    ).not().isEmpty().isLength({min : 6, max: 10}),
    check(
        'company',
        'Car company name is required'
    ).not().isEmpty(),
    check(
        'model',
        'Car model name is required'
    ).not().isEmpty(),
    check(
        'type',
        'Car type is required'
    ).not().isEmpty(),
    check(
        'seatingCapacity',
        'Car seating capacity is required'
    ).not().isEmpty(),
    check(
        'rent',
        'Car rent per day is required'
    ).not().isEmpty()

]],car.create);

//@route GET api/cars
//@desc Get all cars
//access Public
router.get("/",car.index);


//@route GET api/cars/filter
//@dsc Filter cars according to requirement
//access PUblic
router.get("/filter",car.filter);

//@route Get api/cars/:car_id
//@desc Get car by Id
//access Public
router.get("/:car_id",[checkObjectId('car_id')], car.view);


//@route PUT api/cars/:car_id
//@desc Edit Car
//access Admin Only
router.put("/:car_id",[ isAdmin,checkObjectId('car_id'), [
    check(
        'registrationNumber',
        'Car registration number is required'
    ).not().isEmpty().isLength({min : 6, max: 10}),
    check(
        'company',
        'Car company name is required'
    ).not().isEmpty(),
    check(
        'model',
        'Car model name is required'
    ).not().isEmpty(),
    check(
        'type',
        'Car type is required'
    ).not().isEmpty(),
    check(
        'seatingCapacity',
        'Car seating capacity is required'
    ).not().isEmpty(),
    check(
        'rent',
        'Car rent per day is required'
    ).not().isEmpty()

]],car.update);


//@route Delete api/cars/:car_id
//@desc Delete car
//access Admin Only
router.delete("/:car_id",[isAdmin, checkObjectId('car_id')],car.delete);

module.exports=router;