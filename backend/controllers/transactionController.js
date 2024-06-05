const axios = require('axios');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

exports.getRate = async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
    const rate = response.data.cardano.usd;
    res.json({ rate });
  } catch (error) {
    console.error('Error fetching ADA rate:', error.message);
    res.status(500).send('Error fetching ADA rate');
  }
};

exports.transfer = async (req, res) => {
  const { from, to, amountADA, amountUSD } = req.body;
  try {
    let recipient = await User.findOne({ address: to });
    if (!recipient) {
      recipient = new User({ address: to, balanceUSD: 0 });
    }
    recipient.balanceUSD += amountUSD;
    await recipient.save();

    const transaction = new Transaction({
      from,
      to,
      amountADA,
      amountUSD,
      recipientBalanceUSD: recipient.balanceUSD
    });
    await transaction.save();

    res.status(201).send('Transaction recorded');
  } catch (error) {
    console.error('Error recording transaction:', error.message);
    res.status(500).send('Error recording transaction');
  }
};

exports.getBalance = async (req, res) => {
  try {
    const user = await User.findOne({ address: req.params.address });
    if (user) {
      res.json({ balanceUSD: user.balanceUSD });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching user balance:', error.message);
    res.status(500).send('Error fetching user balance');
  }
};

exports.transferToInternalWallet = async (req, res) => {
  const { fromUserId, toUserId, amountUSD } = req.body;
  try {
    const senderWallet = await Wallet.findOne({ userId: fromUserId });
    const recipientWallet = await Wallet.findOne({ userId: toUserId });

    if (!senderWallet || !recipientWallet) {
      return res.status(404).send('Sender or recipient wallet not found');
    }

    if (senderWallet.balanceUSD < amountUSD) {
      return res.status(400).send('Insufficient balance');
    }

    senderWallet.balanceUSD -= amountUSD;
    recipientWallet.balanceUSD += amountUSD;

    await senderWallet.save();
    await recipientWallet.save();

    res.status(200).send('Transfer successful');
  } catch (error) {
    console.error('Error transferring funds:', error.message);
    res.status(500).send('Error transferring funds');
  }
};
