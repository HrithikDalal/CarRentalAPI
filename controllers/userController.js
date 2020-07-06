const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const {validationResult} = require('express-validator');

const User = require("../models/User");




//REGISTER NEW USER
exports.register = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name , email, password}=req.body;
    
    try{
        // See if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors : [{msg: "User already exists"}] });
        }


        //Instant of User

        user = new User({
            name,
            email,
            password,
        });

        //Encrypt password

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        //Save User to the Database

        await user.save();

        //Return jsonwebtoken

        const payload = {
            user :{
                id : user.id,
                admin : user.admin
            }
        }

        jwt.sign(payload,config.get("jwtSecret"), {expiresIn : 3600000}, (err,token) =>
         {
            if(err)
                throw err;
            res.json({token});
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};


//USER LOGIN
exports.login = async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password}=req.body;
    
    try{
        // See if user exists
        let user = await User.findOne({email});
        if(!user){
            return res
            .status(400)
            .json({errors : [{msg: "Invalid Credentials"}] });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        //Match Password
        if(!isMatch){
            return res
            .status(400)
            .json({errors : [{msg: "Invalid Credentials"}] });
        }

        //Return jsonwebtoken

        const payload = {
            user :{
                id : user.id,
                admin : user.admin
            }
        }

        jwt.sign(payload,config.get("jwtSecret"), {expiresIn : 3600}, (err,token) =>
         {
            if(err)
                throw err;
            res.json({token});
        });
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

//CURRENT USER 
exports.current = async(req,res) => {
    try{
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
        
    }catch(err){
        console.error(err,message);
        res.status(500).send("Server Error");
    }
};
