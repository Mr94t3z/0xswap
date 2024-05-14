import dotenv from 'dotenv';
import qs from 'qs';

// Load environment variables from .env file
dotenv.config();

async function fetchWethUsdPrice() {
  const url = 'https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    return data.weth.usd;
  } catch (error) {
    console.error('Error fetching WETH price in USD:', error);
    return null;
  }
}

async function fetchSwapPrice() {
  const params = {
    buyToken: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN
    sellToken: '0x4200000000000000000000000000000000000006', // WETH
    buyAmount: '1000000000000000000', // 1 DEGEN (DEGEN uses 18 decimal places)
    takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', // Taker address
  };

  const headers = { '0x-api-key': process.env.ZEROX_API_KEY || '' };
  
  const url = `https://base.api.0x.org/swap/v1/price?${qs.stringify(params)}`;
  console.log('Request URL:', url);
  console.log('Headers:', headers);

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Swap Quote:', data);

    const wethUsdPrice = await fetchWethUsdPrice();
    if (wethUsdPrice !== null) {
      const degenToWethRate = parseFloat(data.price);
      const degenToUsdPrice = degenToWethRate * wethUsdPrice;
      console.log(`Price of 1 DEGEN in USD: $${degenToUsdPrice.toFixed(5)}`);
    } else {
      console.error('Could not fetch WETH price in USD');
    }
  } catch (error) {
    console.error('Error fetching swap price:', error);
  }
}

// Call the function
fetchSwapPrice();
