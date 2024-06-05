import Web3 from 'web3';

// MetaMask connection
export const connectToMetaMask = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } else {
    throw new Error('MetaMask not detected');
  }
};

// Eternl connection
export const connectToEternl = async () => {
  if (window.cardano && window.cardano.eternl) {
    try {
      const api = await window.cardano.eternl.enable();
      const address = await api.getUsedAddresses();
      return address[0];
    } catch (err) {
      throw new Error('Error connecting to Eternl: ' + err.message);
    }
  } else {
    throw new Error('Eternl wallet not detected');
  }
};
