require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("dotenv").config("./.env");
/** @type import('hardhat/config').HardhatUserConfig */

const privateKey = process.env.privateKey;

module.exports = {
  networks: {
    hardhat: {
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    goerli: {
      url: process.env.infuraGoerliUrl,
      accounts: [privateKey],
    },
    sepolia: {
      url: process.env.infuraSepoliaUrl,
      accounts: [privateKey],
    }
  },
  etherscan: {
    apiKey: process.env.etherscanApiKey,
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
}