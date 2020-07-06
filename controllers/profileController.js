const {validationResult } = require('express-validator');
const normalize = require('normalize-url'); // bring in normalize to give us a proper url, regardless of what user entered
const Profile = require('../models/Profile');
const User = require('../models/User');
const Booking = require('../models/Booking');


//get current user profile
exports.my = async (req, res) => {
    try {
      const profile = await Profile.findOne({
        user: req.user.id
      }).populate('user', ['name', 'avatar']);
  
      if (!profile) {
        return res.status(400).json({ msg: 'There is no profile for this user' });
      }
  
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


//create new profile
exports.create = async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
}
const {
    avatar,
    address,
    phoneNum,
    sex,
    bio,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook
} = req.body;

const profileFields = {
    user: req.user.id,
    avatar,
    address,
    phoneNum,
    sex,
    bio,
};

const socialfields = { youtube, twitter, instagram, linkedin, facebook }; // Build social object and add to profileFields

for (const [key, value] of Object.entries(socialfields)) {
    if (value && value.length > 0)
    socialfields[key] = normalize(value, { forceHttps: true });
}
profileFields.social = socialfields;

try {
    let profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileFields },
    { new: true, upsert: true } // Using upsert option (creates new doc if no match is found):
    );
    res.json(profile);
} catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
}
  };

  
//get all profiles
exports.index = async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name']);
      res.json(profiles);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


//get profile by id
exports.view =  async (req, res) => {
    try {
      const profile = await Profile.findOne({user : req.params.user_id}).populate('user', ['name']);

      if (!profile) return res.status(400).json({ msg: 'Profile not found' });

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ msg: 'Server error' });
    }
  };



//delete profile
exports.delete = async (req, res) => {
    try {
      //Remove user bookings
      await Booking.deleteMany({ user: req.user.id });
      // Remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      // Remove user
      await User.findOneAndRemove({ _id: req.user.id });
  
      res.json({ msg: 'User deleted' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };