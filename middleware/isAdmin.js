const jwt =require("jsonwebtoken");
const config = require("config");
const User = require('../models/User')

module.exports = function(req,res,next){
    //Get token from header
    const token = req.header("x-auth-token");

    //check if not token
    if(!token){
        return res.status(401).json({
            msg : "No token, authorization denied"
        });
    }

    //veriy token
    try{
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
       if(req.user.admin){
           next();
       }
       else{
        return res.status(401).json({ msg: 'User does not have admin rights' });
       }
    } catch(err){
        res.status(401).json({msg : "Token is not valid"});
    }
}