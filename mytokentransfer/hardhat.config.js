require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { private_key, alchemyurl } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: alchemyurl,
      accounts: [`0x${private_key}`],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};
