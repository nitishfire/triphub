const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  userId: { type: String },
  paymentId: { type: String, required: true },
  bookingId: { type: String, required: true, unique: true },
  roomId: { type: String },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  capacity: { type: Number, required: true },
  roomType: { type: String, required: true },
  availableDays: { type: String, required: true },
  roomNumber: { type: Number, required: true },
  pricePerNight: { type: Number, required: true },
  paymentStatus: { type: String, default: 'Accepted' },
  description: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] }
}, { timestamps: true });
module.exports = mongoose.model('Booking', BookingSchema);
