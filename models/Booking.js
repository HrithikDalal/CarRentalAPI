const mongoose = require("mongoose");
const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      car:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
      },
    issueDate: {
        type: Date,
        required: true
    },
    returnDate:{
        type: Date, 
        required: true
    },
    createdOn:
    {
        type: Date,
        default: Date.now
    }
});
 
module.exports = Booking = mongoose.model("Booking", BookingSchema);