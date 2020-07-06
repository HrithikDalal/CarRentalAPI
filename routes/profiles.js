const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { check} = require('express-validator');
const checkObjectId = require('../middleware/checkObjectId');
const profile = require('../controllers/profileController');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth,profile.my);


// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private
router.post('/',
[
    auth,
    [
    check('address', 'Address is required').not().isEmpty(),
    check('phoneNum', 'Phone number is required').not().isEmpty().isLength(10)
    ]
],profile.create);


// @route    GET api/profile
// @desc     Get all profiles
// @access   Admiin Only
router.get('/',isAdmin, profile.index);


// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Admin Only
router.get('/user/:user_id',[isAdmin, checkObjectId('user_id')], profile.view);


// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, profile.delete);

module.exports = router;