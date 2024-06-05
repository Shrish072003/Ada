const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/rate', transactionController.getRate);
router.post('/transfer', transactionController.transfer);
router.get('/balance/:address', transactionController.getBalance);
router.post('/internalTransfer', transactionController.transferToInternalWallet);

module.exports = router;
