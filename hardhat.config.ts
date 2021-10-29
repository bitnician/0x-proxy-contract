import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-typechain";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const DEFAULT_COMPILER_SETTINGS = {
  version: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

export default {
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/bd49cbfbe0ab4e079db5f4e33636c6fa",
      },
    },
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
  },
};
