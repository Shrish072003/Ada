const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

router.post('/create', async (req, res) => {
  const { userId } = req.body;
  try {
    const wallet = new Wallet({ userId, balanceUSD: 0 });
    await wallet.save();
    res.status(201).send('Wallet created');
  } catch (error) {
    console.error('Error creating wallet:', error.message);
    res.status(500).send('Error creating wallet');
  }
});

module.exports = router;
