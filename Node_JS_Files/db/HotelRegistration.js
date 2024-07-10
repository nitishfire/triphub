const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema({
    hotelid:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    phoneno:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    hamount:{
        type:Number,
        required:true,
    }
    
})

const hotel = new mongoose.model("hotelRegistration", HotelSchema);

module.exports = hotel; 