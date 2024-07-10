const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    paymentid:{
        type:String,
        required:true,
    },
    bookingid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    roomtype:{
        type:String,
        required:true
    },
    avail:{
        type:String,
        required:true
    },
    roomno:{
        type:Number,
        required:true
    },
    pricepernight:{
        type:Number,
        required:true
    }, 
    paymentstatus:{
        type:String,
        required:true
    }
    
})

const booking = new mongoose.model("booking", BookingSchema);

module.exports = booking; 