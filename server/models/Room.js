const mongoose = require('mongoose');
const RoomSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  roomType: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  availableDays: { type: String, required: true },
  description: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('Room', RoomSchema);
