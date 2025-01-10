import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts", // Default: contracts
    tests: "./test",       // Default: test
    cache: "./cache",      // Default: cache
    artifacts: "./artifacts", // Default: artifacts
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
};

export default config;
