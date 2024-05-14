import { Button, Frog, TextInput } from 'frog'
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
  browserLocation : 'https://github.com/Mr94t3z/0xswap',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: 'Space Mono',
        source: 'google',
      },
    ],    
  },
})

// 0x API Key
const headers = {'0x-api-key': process.env.ZEROX_API_KEY || ''};

// Function to fetch WETH to USD price
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

// Function to fetch DEGEN price in USD
async function fetchDegenUsdPrice() {
  const params = {
    buyToken: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', // DEGEN
    sellToken: '0x4200000000000000000000000000000000000006', // WETH
    buyAmount: '1000000000000000000', // 1 DEGEN (DEGEN uses 18 decimal places)
    takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', // Taker address
  };
  
  const url = `https://base.api.0x.org/swap/v1/price?${qs.stringify(params)}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const wethUsdPrice = await fetchWethUsdPrice();
    if (wethUsdPrice !== null) {
      const degenToWethRate = parseFloat(data.price);
      const degenToUsdPrice = degenToWethRate * wethUsdPrice;
      return degenToUsdPrice.toFixed(5); // Return the price of DEGEN in USD
    } else {
      console.error('Could not fetch WETH price in USD');
      return null;
    }
  } catch (error) {
    console.error('Error fetching swap price:', error);
    return null;
  }
}

// Function to fetch DAI price in USD
async function fetchDaiUsdPrice() {
  const params = {
    sellToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    buyToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    sellAmount: '1000000000000000000', // 1 DAI (DAI uses 18 decimal places)
    takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', // Taker address
  };
  
  const url = `https://api.0x.org/swap/v1/price?${qs.stringify(params)}`;

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    const wethUsdPrice = await fetchWethUsdPrice();
    if (wethUsdPrice !== null) {
      const daiToWethRate = parseFloat(data.price);
      const daiToUsdPrice = daiToWethRate * wethUsdPrice;
      return daiToUsdPrice.toFixed(5); // Return the price of DAI in USD
    } else {
      console.error('Could not fetch WETH price in USD');
      return null;
    }
  } catch (error) {
    console.error('Error fetching DAI swap price:', error);
    return null;
  }
}

app.frame('/', async (c) => {
  const degenUsdPrice = await fetchDegenUsdPrice(); // Fetch the DEGEN price in USD
  const daiUsdPrice = await fetchDaiUsdPrice(); // Fetch the DAI price in USD

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'black',
          fontFamily: 'Space Mono',
          fontSize: 45,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 0,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        Choose the available token below to swap using 0x.org API Swap

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            fontSize: 32,
            marginTop: 50,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: 150
            }}
          >
            <img
              src='/dai.png'
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                marginBottom: 10,
              }}
              alt="DAI"
            />
            <div>DAI</div>
            <p style={{ color: "#FAB427", justifyContent: 'center', textAlign: 'center', fontSize: 28, margin: 0}}>${daiUsdPrice}</p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <img
              src='/degen.png'
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                marginBottom: 10,
              }}
              alt="DEGEN"
            />
            <div>DEGEN</div>
            <p style={{ color: "#A36DFD", justifyContent: 'center', textAlign: 'center', fontSize: 28, margin: 0}}>${degenUsdPrice ? degenUsdPrice : 'N/A'}</p>
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button action="/dai">Swap $DAI</Button>,
      <Button action="/degen">Swap $DEGEN</Button>,
    ],
  })
})

app.frame('/dai', (c) => {
  return c.res({
    action: '/dai-finish',
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#FAB427',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'white',
          fontFamily: 'Space Mono',
          fontSize: 45,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 0,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
          border: '1em solid rgb(255,255,255)'
        }}
      >
        <img
            src='/dai.png'
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              marginBottom: 50,
            }}
            width={200} 
            height={200} 
          />
        Swap $DAI ♾️ $ETH
      </div>
    ),
    intents: [
      <TextInput placeholder="Amount of $DAI for Buy / $ETH for Sell" />,
      <Button.Transaction target="/dai-buy">📈 Buy</Button.Transaction>,
      <Button.Transaction target="/dai-sell">📉 Sell</Button.Transaction>,
      <Button action="/">⏏︎ Back</Button>,
    ],
  })
})

app.frame('/degen', (c) => {
  return c.res({
    action: '/degen-finish',
    image: (
      <div
        style={{
          alignItems: 'center',
          background: '#A36EFD',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          color: 'white',
          fontFamily: 'Space Mono',
          fontSize: 45,
          fontStyle: 'normal',
          letterSpacing: '-0.025em',
          lineHeight: 1.4,
          marginTop: 0,
          padding: '0 120px',
          whiteSpace: 'pre-wrap',
          border: '1em solid rgb(255,255,255)'
        }}
      >
        <img
            src='/degen.png'
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
              marginBottom: 50,
            }}
            width={200} 
            height={200} 
          />
        Swap $DEGEN ♾️ $WETH
      </div>
    ),
    intents: [
      <TextInput placeholder="Amount of $DEGEN e.g. 100" />,
      <Button.Transaction target="/degen-buy">📈 Buy</Button.Transaction>,
      <Button.Transaction target="/degen-sell">📉 Sell</Button.Transaction>,
      <Button action="/">⏏︎ Back</Button>,
    ],
  })
})


app.transaction('/dai-buy', async (c, next) => {
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
  const { inputText, address } = c;
  const inputValue = inputText ? parseFloat(inputText) : 0;

  // Assuming DAI token uses 18 decimal places
  const tokenDecimalPrecision = 18;
  const amountInWei = inputValue * Math.pow(10, tokenDecimalPrecision);

  const params = {
    buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //DAI
    sellToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', //ETH
    buyAmount: amountInWei.toString(), // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    takerAddress: address, //Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
  };
  
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

app.transaction('/degen-buy', async (c, next) => {
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
    buyToken: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', //DEGEN
    sellToken: '0x4200000000000000000000000000000000000006', //WETH
    buyAmount: amountInWei.toString(), // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    takerAddress: '0xcB46Bfb7315eca9ECd42D02C1AE174DA4BBFf291', //Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
  };
  
  // Fetch the swap quote.
  const response = await fetch(
    `https://base.api.0x.org/swap/v1/quote?${qs.stringify(params)}`, { headers }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const quote = await response.json();
  
  return c.send({
    chainId: 'eip155:8453',
    to: quote.to,
    data: quote.data,
    value: quote.value,
  })
})


app.transaction('/dai-sell', async (c, next) => {
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
  const { inputText, address } = c;
  const inputValue = inputText ? parseFloat(inputText) : 0;

  // Assuming DAI token uses 18 decimal places
  const tokenDecimalPrecision = 18;
  const amountInWei = inputValue * Math.pow(10, tokenDecimalPrecision);

  const params = {
    sellToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', //ETH
    buyToken: '0x6B175474E89094C44Da98b954EedeAC495271d0F', //DAI
    sellAmount: amountInWei.toString(),
    takerAddress: address, //Including takerAddress is required to help with gas estimation, catch revert issues, and provide the best price
  };
  
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


app.frame('/dai-finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div
      style={{
        alignItems: 'center',
        background: '#FAB427',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'Space Mono',
        fontSize: 45,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        lineHeight: 1.4,
        marginTop: 0,
        padding: '0 120px',
        whiteSpace: 'pre-wrap',
        border: '1em solid rgb(255,255,255)'
      }}
    >
     Transaction ID 📝 
      <p style={{ justifyContent: 'center', textAlign: 'center', fontSize: 24, margin: 0 }}>{transactionId}</p>
    </div>
    ),
    intents: [
      <Button.Link
          href={`https://etherscan.io/tx/${transactionId}`}
        >
        ◉ View on Etherscan
      </Button.Link>,
      <Button action='/dai'>⏏︎ Back</Button>,
    ],
  })
})

app.frame('/degen-finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div
      style={{
        alignItems: 'center',
        background: '#FAB427',
        backgroundSize: '100% 100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        height: '100%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        color: 'white',
        fontFamily: 'Space Mono',
        fontSize: 45,
        fontStyle: 'normal',
        letterSpacing: '-0.025em',
        lineHeight: 1.4,
        marginTop: 0,
        padding: '0 120px',
        whiteSpace: 'pre-wrap',
        border: '1em solid rgb(255,255,255)'
      }}
    >
     Transaction ID 📝 
      <p style={{ justifyContent: 'center', textAlign: 'center', fontSize: 24, margin: 0 }}>{transactionId}</p>
    </div>
    ),
    intents: [
      <Button.Link
          href={`https://basescan.org/tx/${transactionId}`}
        >
        ◉ View on Basescan
      </Button.Link>,
      <Button action='/degen'>⏏︎ Back</Button>,
    ],
  })
})


// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
