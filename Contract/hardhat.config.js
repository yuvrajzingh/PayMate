
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");

dotenv.config({ path: '.env'});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{ //the details about where the network(polygon) we're deploying to will go
    mumbai: {
      url: process.env.POLYGON_MUMBAI,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  etherscan:{ //the details for where our etherscan APIs will go 
    apiKey: process.env.API_KEY,
  }
};



