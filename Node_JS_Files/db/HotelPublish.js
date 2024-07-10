const mongoose = require("mongoose");

const HotelPublishSchema = new mongoose.Schema({
    hotelid:{
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
    roomno:{
        type:Number,
        required:true
    },
    roomtype:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    pricepernight:{
        type:Number,
        required:true
    }, 
    avail:{
        type:String,
        required:true
    } 
})

const hotelpublishs = new mongoose.model("hotelpublishes", HotelPublishSchema);

module.exports = hotelpublishs; 