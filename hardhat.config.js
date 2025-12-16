require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Sepolia Testnet (Ethereum)
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "https://eth-sepolia.g.alchemy.com/v2/demo",
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto"
    },
    // Hoodi Testnet (nếu có RPC URL chính xác)
    hoodi: {
      url: process.env.HOODI_RPC_URL || "https://rpc.hoodi.network/testnet",
      chainId: 990011,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: "auto",
      timeout: 60000
    },
    // Localhost (để test)
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      hoodi: "no-api-key-needed" // Hoodi chưa có explorer verify
    },
    customChains: [
      {
        network: "hoodi",
        chainId: 990011,
        urls: {
          apiURL: "https://testnet.hoodi.network/api",
          browserURL: "https://testnet.hoodi.network"
        }
      }
    ]
  }
};
