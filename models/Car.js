const mongoose = require("mongoose");

const CarSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    registrationNumber:{
        type: String,
        unique : true,
        required : true
    },
    company:{
        type: String, 
        required: true
    },
    model:{
        type: String, 
        required: true
    },
    type:{
        type: String, 
        required: true
    },
    seatingCapacity:{
        type: Number,
        required: true
    },
    rent:{
        type: Number, 
        required: true
    },
   addedOn:{
    type: Date, 
    default: Date.now
},
});

module.exports = Car = mongoose.model("car", CarSchema);
