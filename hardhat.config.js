require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 69,
      },
    },
  },
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    // Rinkeby
    rinkeby: {
      url: process.env.RINKEBY_URL,
      chainId: 4,
      accounts:
        process.env.TESTNET_DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.TESTNET_DEPLOYER_PRIVATE_KEY]
          : [],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
        },
      },
    },
    // Mainnet (!!!)
    mainnet: {
      url: process.env.MAINNET_URL,
      timeout: 120000,
      chainId: 1,
      accounts:
        process.env.MAINNET_DEPLOYER_PRIVATE_KEY !== undefined
          ? [process.env.MAINNET_DEPLOYER_PRIVATE_KEY]
          : [],
      verify: {
        etherscan: {
          apiKey: process.env.ETHERSCAN_API_KEY,
        },
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      rinkeby:
        process.env.TESTNET_DEPLOYER_ADDRESS !== undefined
          ? process.env.TESTNET_DEPLOYER_ADDRESS
          : 0,
      mainnet:
        process.env.MAINNET_DEPLOYER_ADDRESS !== undefined
          ? process.env.MAINNET_DEPLOYER_ADDRESS
          : 0,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
