const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/TripHub", {
}).then(() => {
    console.log(`Connection SucessFully`)
}).catch((e) => {
    console.log(`There Is No Connection!!!`)
})