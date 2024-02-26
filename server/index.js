const dotenv = require("dotenv");
const result = dotenv.config({ path: '.env' });
if (result.error) {
  throw result.error;
}

const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
const port = 3001;
const ABI = require("./abi.json");

const corsConfig = {
  origin: "*",
  Credential: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
app.use(express.json());


function convertArrayToObjects(arr) {// as we are getting an array of arrays in our getMyHistory function (fourthResponse) and it would be easier to convert it to object so that we can integrate it in our frontend easily
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0,4)}...${transaction[3].slice(0,4)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
}

app.get('/', (req, res) =>{  //default route
  res.json("Hello");
})

app.get("/getNameAndBalance", async (req, res) => {  //where we'll query the moralis API for read only functions in our smart contract for eg. getMyRequests
  const { userAddress } = req.query; // to get the name of the user that we've send to that end point

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881", // hex index for the mumbai testnet
    address: "0x634fb013eCB5dF92d00e617f1f87B10fAa21B9E5", //smart contract address
    functionName: "getMyName", 
    abi: ABI, // can get this from polygon scan itself
    params: { _user: userAddress },// since the getName function takes one param that is userAddress and we are setting it to the 
  });

  const jsonResponseName = response.raw; // getting the raw format of the above's response and saving that to a var 

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x13881",
    address: userAddress,
  });


  const jsonResponseBal = (secResponse.raw.balance/1e18).toFixed(2); // "1e18" since matic has 18 decimals and we are setting it to 2 decimals using toFixed(2) 

  const thirdResponse = await Moralis.EvmApi.token.getTokenPrice({ // setting the matic token on the ethereum network so that we can convert it to dollar
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  });

  const jsonResponseDollars = ( // converting it to dollars
    thirdResponse.raw.usdPrice * jsonResponseBal
  ).toFixed(2);

  const jsonResponseRupees = ( // converting it to rupees
    jsonResponseDollars * 82.88
  ).toFixed(2);
  


  const fourthResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881", // hex index for the mumbai testnet
    address: "0x634fb013eCB5dF92d00e617f1f87B10fAa21B9E5", //smart contract address
    functionName: "getMyHistory",
    abi: ABI, // can get this from polygon scan itself
    params: { _user: userAddress },// since the getMyHistory function takes one param that is userAddress and we are setting it to the 
  })

  const jsonResponseHistory = convertArrayToObjects(fourthResponse.raw);

  const fifthResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881", // hex index for the mumbai testnet
    address: "0x634fb013eCB5dF92d00e617f1f87B10fAa21B9E5", //smart contract address
    functionName: "getMyRequests",
    abi: ABI, // can get this from polygon scan itself
    params: { _user: userAddress },// since the getMyRequests function takes one param that is userAddress and we are setting it to the 
  })

  const jsonResponseRequests = fifthResponse.raw;

  const jsonResponse = { // an object of responses from all the functions
    name: jsonResponseName,
    balance: jsonResponseBal,
    rupees: jsonResponseRupees,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
  }

  return res.status(200).json(jsonResponse);
});


Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls on port ${port}`);
  });
});




