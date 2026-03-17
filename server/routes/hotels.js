const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const User = require('../models/User');
const Booking = require('../models/Booking');

router.get('/stats', async (req, res) => {
  try {
    const [totalRooms, totalHotels, totalUsers, totalBookings] = await Promise.all([
      Room.countDocuments({ roomNumber: { $ne: 0 } }),
      Hotel.countDocuments(),
      User.countDocuments(),
      Booking.countDocuments()
    ]);
    res.json({ totalRooms, totalHotels, totalUsers, totalBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ roomNumber: { $ne: 0 } });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/rooms/search', async (req, res) => {
  try {
    const { city, capacity, roomType, minPrice, maxPrice } = req.query;
    const filter = { roomNumber: { $ne: 0 } };
    if (city) filter.address = { $regex: city, $options: 'i' };
    if (capacity) filter.capacity = Number(capacity);
    if (roomType) filter.roomType = { $regex: roomType, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/rooms/mine', authenticate('hotel'), async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.user.hotelId, roomNumber: { $ne: 0 } });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/profile', authenticate('hotel'), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.user.hotelId }).select('-password');
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/rooms', authenticate('hotel'), async (req, res) => {
  try {
    const { roomNumber, roomType, capacity, pricePerNight, availableDays, description, amenities, images } = req.body;
    if (!roomNumber || !roomType || !capacity || !pricePerNight || !availableDays)
      return res.status(400).json({ message: 'All room fields are required' });
    const hotel = await Hotel.findOne({ hotelId: req.user.hotelId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    const dupRoom = await Room.findOne({ hotelId: req.user.hotelId, roomNumber: Number(roomNumber) });
    if (dupRoom) return res.status(409).json({ message: 'Room number already exists for this hotel' });
    await Room.create({
      hotelId: req.user.hotelId, name: hotel.name, address: hotel.address,
      phone: hotel.phone, roomNumber: Number(roomNumber), roomType,
      capacity: Number(capacity), pricePerNight: Number(pricePerNight),
      availableDays, description: description || '',
      amenities: amenities || [], images: images || []
    });
    res.status(201).json({ message: 'Room published successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/rooms/:id', authenticate('hotel'), async (req, res) => {
  try {
    const { roomType, capacity, pricePerNight, availableDays, description, amenities, images } = req.body;
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, hotelId: req.user.hotelId },
      { roomType, capacity: Number(capacity), pricePerNight: Number(pricePerNight), availableDays, description, amenities, images },
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room updated successfully', room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/rooms/:id', authenticate('hotel'), async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ _id: req.params.id, hotelId: req.user.hotelId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
