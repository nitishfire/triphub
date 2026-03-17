const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto');
const authenticate = require('../middleware/auth');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const Hotel = require('../models/Hotel');

router.get('/user-stats', authenticate('user'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const bookings = await Booking.find({ guestName: user.name });
    const totalSpent = bookings.reduce((sum, b) => sum + b.pricePerNight, 0);
    res.json({ totalBookings: bookings.length, totalSpent, balance: user.walletBalance, name: user.name, username: user.username, email: user.email, phone: user.phone });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticate('user'), async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findById(roomId);
    if (!room || room.roomNumber === 0) return res.status(404).json({ message: 'Room not found or unavailable' });
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.walletBalance < room.pricePerNight)
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    await User.findOneAndUpdate({ username: req.user.username }, { walletBalance: user.walletBalance - room.pricePerNight });
    const hotel = await Hotel.findOne({ hotelId: room.hotelId });
    if (hotel) await Hotel.findOneAndUpdate({ hotelId: room.hotelId }, { earnings: hotel.earnings + room.pricePerNight });
    const booking = await Booking.create({
      guestName: user.name, userId: user._id.toString(),
      paymentId: randomUUID(), bookingId: randomUUID(),
      roomId: room._id.toString(),
      name: room.name, address: room.address, phone: room.phone,
      capacity: room.capacity, roomType: room.roomType, availableDays: room.availableDays,
      roomNumber: room.roomNumber, pricePerNight: room.pricePerNight, paymentStatus: 'Accepted',
      description: room.description, amenities: room.amenities, images: room.images
    });
    await Room.findByIdAndDelete(roomId);
    res.status(201).json({ message: 'Room booked successfully!', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', authenticate('user'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const bookings = await Booking.find({ guestName: user.name });
    res.json({ bookings, balance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authenticate('user'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await User.findOneAndUpdate({ username: req.user.username }, { walletBalance: user.walletBalance + booking.pricePerNight });
    const hotel = await Hotel.findOne({ name: booking.name, phone: booking.phone });
    if (hotel) await Hotel.findOneAndUpdate({ _id: hotel._id }, { earnings: Math.max(0, hotel.earnings - booking.pricePerNight) });
    await Room.create({
      hotelId: hotel ? hotel.hotelId : 'unknown', name: booking.name, address: booking.address,
      phone: booking.phone, roomNumber: booking.roomNumber, roomType: booking.roomType,
      capacity: booking.capacity, pricePerNight: booking.pricePerNight, availableDays: booking.availableDays,
      description: booking.description, amenities: booking.amenities, images: booking.images
    });
    await Booking.findOneAndDelete({ bookingId: req.params.id });
    res.json({ message: 'Booking cancelled. Amount refunded to your wallet.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/hotel', authenticate('hotel'), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.user.hotelId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const bookings = await Booking.find({ name: hotel.name });
    res.json({ bookings, earnings: hotel.earnings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/hotel/:id', authenticate('hotel'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const user = await User.findOne({ name: booking.guestName });
    if (user) await User.findOneAndUpdate({ _id: user._id }, { walletBalance: user.walletBalance + booking.pricePerNight });
    const hotel = await Hotel.findOne({ hotelId: req.user.hotelId });
    if (hotel) await Hotel.findOneAndUpdate({ _id: hotel._id }, { earnings: Math.max(0, hotel.earnings - booking.pricePerNight) });
    if (hotel) {
      await Room.create({
        hotelId: hotel.hotelId, name: booking.name, address: booking.address,
        phone: booking.phone, roomNumber: booking.roomNumber, roomType: booking.roomType,
        capacity: booking.capacity, pricePerNight: booking.pricePerNight,
        availableDays: booking.availableDays, description: booking.description, amenities: booking.amenities, images: booking.images
      });
    }
    await Booking.findOneAndDelete({ bookingId: req.params.id });
    res.json({ message: 'Booking cancelled. Amount refunded.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/hotel/:id/details', authenticate('hotel'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const hotel = await Hotel.findOne({ hotelId: req.user.hotelId });
    if (!hotel || booking.name !== hotel.name)
      return res.status(403).json({ message: 'Access denied' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/details', authenticate('user'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
