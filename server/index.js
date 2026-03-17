require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

const buildPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(buildPath));
app.get('*', (req, res) => { res.sendFile(path.join(buildPath, 'index.html')); });

app.listen(PORT, () => { console.log('TripHub server running on http://localhost:' + PORT); });
