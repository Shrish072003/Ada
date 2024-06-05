const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: { type: String, unique: true },
  balanceUSD: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
