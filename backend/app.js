const express = require('express');
const cors = require('cors');
const transactionsRouter = require('./routes/transactions');
const walletsRouter = require('./routes/wallets');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/transactions', transactionsRouter);
app.use('/api/wallets', walletsRouter);

module.exports = app;
