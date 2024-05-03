import { Button, Frog, TextInput, parseEther } from 'frog'
import { handle } from 'frog/vercel'
import dotenv from 'dotenv';
import qs from 'qs';

// Uncomment this packages to tested on local server
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

// Load environment variables from .env file
dotenv.config();

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        
      </div>
    ),
    intents: [
      <TextInput placeholder="Amount of $DAI e.g. 100" />,
      <Button.Transaction target="/buy">📈 Buy</Button.Transaction>,
      <Button.Transaction target="/sell">📉 Sell</Button.Transaction>,
      <Button action="/">⏏︎ Cancel</Button>,
    ],
  })
})


app.transaction('/buy', async (c, next) => {
  await next();
  const txParams = await c.res.json();
  txParams.attribution = false;
  console.log(txParams);
  c.res = new Response(JSON.stringify(txParams), {
    headers: {
      "Content-Type": "application/json",
    },
  });
},
async (c) => {
  const { inputText } = c;
  const inputValue = inputText ? parseFloat(inputText) : 0;

  // Assuming DAI token uses 18 decimal places
  const tokenDecimalPrecision = 18;
  const amountInWei = inputValue * Math.pow(10, tokenDecimalPrecision);

  const params = {
    buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //DAI
    sellToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', //ETH
    sellAmount: amountInWei.toString(), // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    takerAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', //Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
};
  
  const headers = {'0x-api-key': process.env.ZEROX_API_KEY || ''};
  
  // Fetch the swap quote.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const quote = await response.json();
  
  return c.send({
    chainId: 'eip155:1',
    to: quote.to,
    data: quote.data,
    value: quote.value,
  })
})


app.transaction('/sell', async (c, next) => {
  await next();
  const txParams = await c.res.json();
  txParams.attribution = false;
  console.log(txParams);
  c.res = new Response(JSON.stringify(txParams), {
    headers: {
      "Content-Type": "application/json",
    },
  });
},
async (c) => {
  const { inputText } = c;
  const inputValue = inputText ? parseFloat(inputText) : 0;

  // Assuming DAI token uses 18 decimal places
  const tokenDecimalPrecision = 18;
  const amountInWei = inputValue * Math.pow(10, tokenDecimalPrecision);

  const params = {
    sellToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //DAI
    buyToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', //ETH
    sellAmount: amountInWei.toString(), // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    takerAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B', //Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
};
  
  const headers = {'0x-api-key': process.env.ZEROX_API_KEY || ''};
  
  // Fetch the swap quote.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const quote = await response.json();
  
  return c.send({
    chainId: 'eip155:1',
    to: quote.to,
    data: quote.data,
    value: quote.value,
  })
})


// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
