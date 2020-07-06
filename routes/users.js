const express = require("express");
const router = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require('../middleware/auth');
const {check} = require('express-validator');

const User = require("../models/User");

var user = require("../controllers/userController.js");

//@route POST api/user
//@desc Register user
//access Public
router.post("/register",[
    check(
        'name',
        'Name is required')
        .not()
        .isEmpty(),
    check(
        'email',
        'Please enter a valid email')
        .isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters')
        .isLength({min: 6})
 ], user.register);



 //@route POST api/user
//@desc User Login & Get token
//access Public
router.post("/login",[
    check(
        'email',
        'Please enter a valid email')
        .isEmail(),
    check(
        'password',
        'Password is Required')
        .exists()
], user.login);



//@route GET api/user
//@desc Test route/Get current logged user
//access Private

router.get("/",auth, user.current);



module.exports = router;