const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  balanceUSD: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', walletSchema);
