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
    buyToken: '0x912CE59144191C1204E64559FE8253a0e49E6548', // ARBITRUM
    sellToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
    buyAmount: '1000000000000000000', // 1 DEGEN (DEGEN uses 18 decimal places)
    takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', // Taker address
  };

  const headers = { '0x-api-key': process.env.ZEROX_API_KEY || '' };
  
  const url = `https://arbitrum.api.0x.org/swap/v1/price?${qs.stringify(params)}`;
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
      const arbToWethRate = parseFloat(data.price);
      const arbToUsdPrice = arbToWethRate * wethUsdPrice;
      console.log(`Price of 1 ARB in USD: $${arbToUsdPrice.toFixed(5)}`);
    } else {
      console.error('Could not fetch WETH price in USD');
    }
  } catch (error) {
    console.error('Error fetching swap price:', error);
  }
}

// Call the function
fetchSwapPrice();
