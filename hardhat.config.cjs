require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL = process.env.SEPOLIA_URL
const ACCOUNT_KEY = process.env.ACCOUNT_KEY

module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [ACCOUNT_KEY],
      
    }
  },
  paths: {
    artifacts: "./src/artifacts"
  },
};