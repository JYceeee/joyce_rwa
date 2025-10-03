require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// const SEPOLIA_URL = process.env.SEPOLIA_API_URL;
// const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
// const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
// const RPC_URL = process.env.RPC_URL || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "",
  },
  paths: {
    sources: "./contracts", // 如你的合约不在 contracts 目录可调整
    scripts: "./scripts",
  },
};

// ======= 自定义任务：只读调用 =======
task("read", "Call a view/pure function")
  .addParam("addr", "Contract address")
  .addParam("abi", "Path to ABI json file or 'erc20'")
  .addParam("fn", "Function name (e.g. 'symbol')")
  .addOptionalParam("args", "Comma-separated arguments", "")
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const provider = ethers.provider;

    // 加载 ABI
    let abi;
    if (args.abi === "erc20") {
      abi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
      ];
    } else {
      abi = require(require("path").resolve(args.abi)).abi;
    }

    const contract = new ethers.Contract(args.addr, abi, provider);
    const fnArgs = args.args ? args.args.split(",").map(s => s.trim()) : [];
    const result = await contract[args.fn](...fnArgs);
    console.log("Result:", result);
  });

// ======= 自定义任务：写入交易 =======
task("write", "Send a state-changing tx")
  .addParam("addr", "Contract address")
  .addParam("abi", "Path to ABI json file or 'erc20'")
  .addParam("fn", "Function name (e.g. 'transfer')")
  .addOptionalParam("args", "Comma-separated arguments", "")
  .setAction(async (args, hre) => {
    const { ethers } = hre;
    const [signer] = await ethers.getSigners();

    // 加载 ABI
    let abi;
    if (args.abi === "erc20") {
      abi = [
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 value) returns (bool)",
      ];
    } else {
      abi = require(require("path").resolve(args.abi)).abi;
    }

    const contract = new ethers.Contract(args.addr, abi, signer);
    const fnArgs = args.args ? args.args.split(",").map(s => s.trim()) : [];
    const tx = await contract[args.fn](...fnArgs);
    console.log("Sent tx:", tx.hash);
    const rcpt = await tx.wait();
    console.log("Mined in block:", rcpt.blockNumber);
  });
