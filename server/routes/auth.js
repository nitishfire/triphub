const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hotel = require('../models/Hotel');

const SECRET = process.env.JWT_SECRET || 'triphub_super_secret_2024';
const sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: '7d' });

async function checkPassword(input, stored) {
  try {
    const match = await bcrypt.compare(input, stored);
    if (match) return true;
  } catch (_) {}
  return input === stored;
}

router.post('/register', async (req, res) => {
  try {
    const { fullname, username, email, phone, pswd } = req.body;
    if (!fullname || !username || !email || !phone || !pswd)
      return res.status(400).json({ message: 'All fields are required' });
    if (String(phone).length !== 10)
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    if (pswd.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const exists = await User.findOne({ $or: [{ username }, { email }, { phone: String(phone) }] });
    if (exists) return res.status(409).json({ message: 'Username, email or phone already exists' });
    const password = await bcrypt.hash(pswd, 10);
    await User.create({ name: fullname, username, email, phone: String(phone), password, walletBalance: 50000 });
    res.status(201).json({ message: 'Registration successful! Please login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'Username and password required' });
    
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.active) return res.status(403).json({ message: 'Account is suspended' });
    
    const ok = await checkPassword(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Incorrect password' });
    
    // Always use 'user' for non-admin customers so frontend checks work consistently
    const tokenType = user.type === 'admin' ? 'admin' : 'user';
    const token = sign({ id: user._id, username, name: user.name, type: tokenType });
    res.json({ token, type: tokenType, username, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/hotel/register', async (req, res) => {
  try {
    const { id, hname, adrs, phone, pswd } = req.body;
    if (!id || !hname || !adrs || !phone || !pswd)
      return res.status(400).json({ message: 'All fields are required' });
    if (String(phone).length !== 10)
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
    if (pswd.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const exists = await Hotel.findOne({ $or: [{ hotelId: id }, { phone: String(phone) }] });
    if (exists) return res.status(409).json({ message: 'Hotel ID or phone already registered' });
    const password = await bcrypt.hash(pswd, 10);
    await Hotel.create({ hotelId: id, name: hname, address: adrs, phone: String(phone), password, earnings: 0 });
    res.status(201).json({ message: 'Hotel registered successfully! Please login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update logged-in user's profile (name, phone, avatar)
router.put('/profile', require('../middleware/auth')('user'), async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const update = {};
    if (name && name.trim()) update.name = name.trim();
    if (phone) {
      if (String(phone).length !== 10) return res.status(400).json({ message: 'Phone must be 10 digits' });
      update.phone = String(phone);
    }
    if (avatar !== undefined) update.avatar = avatar; // base64 or ''
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      update,
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/hotel/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password)
      return res.status(400).json({ message: 'Hotel ID and password required' });
    const hotel = await Hotel.findOne({ hotelId: id });
    if (!hotel) return res.status(401).json({ message: 'Hotel not found' });
    if (!hotel.active) return res.status(403).json({ message: 'Account is suspended' });
    
    const ok = await checkPassword(password, hotel.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign({ id: hotel._id, hotelId: id, name: hotel.name, type: 'hotel' });
    res.json({ token, type: 'hotel', hotelId: id, name: hotel.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
