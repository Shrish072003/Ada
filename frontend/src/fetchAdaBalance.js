import axios from 'axios';

async function fetchAdaBalance(address) {
  try {
    const response = await axios.get(`https://api.cardano.com/v1/addresses/${address}`);
    return response.data.balance;
  } catch (error) {
    console.error('Error fetching ADA balance', error);
    return 0;
  }
}

export default fetchAdaBalance;
