require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();  // Добавляем загрузку переменных окружения

module.exports = {
  solidity: "0.8.20",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    // nodeModules обычно не требуется указывать - удалите эту строку
  },
  networks: {
    sepolia: {
      url: process.env.INFURA_URL || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Добавьте локальную сеть для тестирования
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
  // Добавьте настройки для тестов
  mocha: {
    timeout: 20000
  }
};