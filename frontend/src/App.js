import React, { useEffect, useState } from 'react';
import axios from 'axios';
import fetchAdaBalance from './fetchAdaBalance';
import { connectToMetaMask, connectToEternl } from './walletConnect';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [adaBalance, setAdaBalance] = useState(0);
  const [adaRate, setAdaRate] = useState(0);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [recipientBalanceUSD, setRecipientBalanceUSD] = useState(0);
  const [wallet, setWallet] = useState('');
  const [internalRecipientId, setInternalRecipientId] = useState('');
  const [usdAmount, setUsdAmount] = useState('');

  useEffect(() => {
    fetchAdaRate();
  }, []);

  const fetchAdaRate = async () => {
    try {
      const response = await axios.get('http://206.189.136.65:4000/api/transactions/rate');
      setAdaRate(response.data.rate);
    } catch (error) {
      console.error('Error fetching ADA rate:', error.message);
      alert('Error fetching ADA rate');
    }
  };

  const fetchRecipientBalance = async (address) => {
    try {
      const response = await axios.get(`http://206.189.136.65:4000/api/transactions/balance/${address}`);
      setRecipientBalanceUSD(response.data.balanceUSD);
    } catch (error) {
      console.error('Error fetching recipient balance:', error.message);
      alert('Error fetching recipient balance');
    }
  };

  const handleTransfer = async () => {
    const amountUSD = transferAmount * adaRate;
    try {
      await axios.post('http://206.189.136.65:4000/api/transactions/transfer', {
        from: account,
        to: recipient,
        amountADA: transferAmount,
        amountUSD
      });
      fetchRecipientBalance(recipient);
      alert('Transfer successful');
    } catch (error) {
      console.error('Error making transfer:', error.message);
      alert('Error making transfer');
    }
  };

  const handleInternalTransfer = async () => {
    try {
      await axios.post('http://206.189.136.65:4000/api/transactions/internalTransfer', {
        fromUserId: account,
        toUserId: internalRecipientId,
        amountUSD: usdAmount
      });
      alert('Internal transfer successful');
    } catch (error) {
      console.error('Error transferring funds:', error.message);
      alert('Error transferring funds');
    }
  };

  const handleWalletConnect = async (walletType) => {
    setWallet(walletType);
    try {
      if (walletType === 'MetaMask') {
        const account = await connectToMetaMask();
        setAccount(account);
        const balance = await fetchAdaBalance(account);
        setAdaBalance(balance);
      } else if (walletType === 'Eternl') {
        const account = await connectToEternl();
        setAccount(account);
        const balance = await fetchAdaBalance(account);
        setAdaBalance(balance);
      }
    } catch (error) {
      console.error(`Error connecting to ${walletType}:`, error.message);
      alert(`Error connecting to ${walletType}`);
    }
  };

  return (
    <div className="app-container">
      <h1>Wallet ADA Wallet</h1>
      <div className="wallet-buttons">
        <button onClick={() => handleWalletConnect('MetaMask')}>Connect MetaMask</button>
        <button onClick={() => handleWalletConnect('Eternl')}>Connect Eternl</button>
      </div>
      {account && (
        <>
          <div className="info-container">
            <p>Account: {account}</p>
            <p>ADA Balance: {adaBalance}</p>
            <p>ADA to USD Rate: ${adaRate}</p>
          </div>
          <div className="form-container">
            <input
              type="text"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Amount in ADA"
            />
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient Address"
            />
            <button onClick={handleTransfer}>Transfer ADA</button>
          </div>
          <div className="internal-transfer-container">
            <input
              type="text"
              value={internalRecipientId}
              onChange={(e) => setInternalRecipientId(e.target.value)}
              placeholder="Recipient User ID"
            />
            <input
              type="text"
              value={usdAmount}
              onChange={(e) => setUsdAmount(e.target.value)}
              placeholder="Amount in USD"
            />
            <button onClick={handleInternalTransfer}>Transfer to Internal Wallet</button>
          </div>
          <div className="balance-container">
            <h2>Recipient Balance</h2>
            <p>{recipientBalanceUSD} USD</p>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
