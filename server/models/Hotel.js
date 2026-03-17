const mongoose = require('mongoose');
const HotelSchema = new mongoose.Schema({
  hotelId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  earnings: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Hotel', HotelSchema);
