import dotenv from 'dotenv';
import qs from 'qs';

// Load environment variables from .env file
dotenv.config();

async function fetchSwapQuote() {
  const params = {
    buyToken: '0x4200000000000000000000000000000000000006', //WETH
    sellToken: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', //DEGEN
    sellAmount: '1000000000000000000000', // Note that the WETH token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    // takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', // Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
    includedSources: 'Uniswap_V3',
    // excludedSources: '0x,Kyber'
  };

  const headers = { '0x-api-key': process.env.ZEROX_API_KEY || '' };
  
  const url = `https://base.api.0x.org/swap/v1/quote?${qs.stringify(params)}`;
  console.log('Request URL:', url);
  console.log('Headers:', headers);

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text(); // Get the error message from the response body
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching swap quote:', error);
  }
}

// Call the function
fetchSwapQuote();


// Error Logs:

// Error fetching swap quote: Error: HTTP error! Status: 400 - {"code":111,"reason":"Gas estimation failed"}
// at fetchSwapQuote (file:///Users/0xgets/Documents/Blockchain%20Development/farcaster-dev/frames/0xswap/test/quote.js:27:13)
// at process.processTicksAndRejections (node:internal/process/task_queues:95:5)