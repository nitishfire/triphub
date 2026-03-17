const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: 'customer', enum: ['customer', 'admin'] },
  active: { type: Boolean, default: true },
  walletBalance: { type: Number, default: 50000 }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
