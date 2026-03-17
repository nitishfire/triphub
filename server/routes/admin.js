const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

router.get('/hotels', authenticate('admin'), async (req, res) => {
  try { res.json(await Hotel.find().select('-password')); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/users', authenticate('admin'), async (req, res) => {
  try { res.json(await User.find().select('-password')); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/hotels/:hotelId', authenticate('admin'), async (req, res) => {
  try {
    await Hotel.findOneAndDelete({ hotelId: req.params.hotelId });
    await Room.deleteMany({ hotelId: req.params.hotelId });
    res.json({ message: 'Hotel removed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/hotels/:hotelId/toggle-active', authenticate('admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.params.hotelId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    hotel.active = !hotel.active;
    await hotel.save();
    res.json(hotel);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/users/:userId/toggle-active', authenticate('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.active = !user.active;
    await user.save();
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/bookings/:guestName', authenticate('admin'), async (req, res) => {
  try { res.json(await Booking.find({ guestName: req.params.guestName })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/hotels/:hotelId/rooms', authenticate('admin'), async (req, res) => {
  try { res.json(await Room.find({ hotelId: req.params.hotelId })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/hotels/:hotelId/bookings', authenticate('admin'), async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ hotelId: req.params.hotelId });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(await Booking.find({ name: hotel.name }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/stats', authenticate('admin'), async (req, res) => {
  try {
    const [totalUsers, totalHotels, totalBookings] = await Promise.all([
      User.countDocuments(), Hotel.countDocuments(), Booking.countDocuments()
    ]);
    const rev = await Booking.aggregate([{ $group: { _id: null, total: { $sum: '$pricePerNight' } } }]);
    res.json({ totalUsers, totalHotels, totalBookings, totalRevenue: rev[0]?.total || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
