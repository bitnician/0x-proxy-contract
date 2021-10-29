const Web3 = require("web3");
const axios = require("axios");
const { BigNumber } = require("bignumber.js");
const { BN } = require("bn.js");
const {
  abi: tokenAbi,
} = require("./artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json");
const {
  abi: proxyAbi,
} = require("./artifacts/contracts/Proxy.sol/Proxy0x.json");

const web3 = new Web3(
  "https://ropsten.infura.io/v3/1b224486b8a1474cad650814061e0611"
);

const proxyAddress = "0x601eE82A318F8359015dd49FC439fAe72793D284";
const daiAddress = "0xad6d458402f60fd3bd25163575031acdce07538d";
const usdcAddress = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

const privateKey =
  "1c791fd6789b42810f8f6ccd3da29fe488ec1baf7ce8be05cb5c24d6c1f6ebd7";

web3.eth.accounts.wallet.add("0x" + privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;

const proxy = new web3.eth.Contract(proxyAbi, proxyAddress);
const daiToken = new web3.eth.Contract(tokenAbi, daiAddress);
const usdcToken = new web3.eth.Contract(tokenAbi, usdcAddress);

async function main() {
  const sellToken = "dai";
  const buyToken = "usdc";
  const buyTokenDecimals = 6;

  const outputAmount = new BigNumber(10).times(
    new BigNumber(10).pow(buyTokenDecimals)
  ); //uni

  const { data } = await axios.get(
    `https://ropsten.api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&buyAmount=${+outputAmount}`
  );

  const {
    guaranteedPrice,
    allowanceTarget,
    to,
    data: callData,
    buyAmount,
  } = data;

  const gPriceBN = new BN(guaranteedPrice.replace(".", ""));
  const bAmountBN = new BN(buyAmount);

  const multiplier = new BN("10").pow(new BN(buyTokenDecimals));
  const sellAmountMax = bAmountBN.mul(gPriceBN).div(multiplier);

  console.log({
    usdcBuyAmount: bAmountBN.toString(),
    uniSellAmount: sellAmountMax.toString(),
  });

  const approveHash = await daiToken.methods
    .approve(proxyAddress, sellAmountMax.toString())
    .send({
      from: myWalletAddress,
      gas: 1000000,
      gasPrice: web3.utils.toWei("20", "gwei"),
    });
  console.log({ approveHash: approveHash.transactionHash });
  console.log(
    "*** Waiting to send transaction for calling the deposit on bridge contract"
  );

  const proxyHash = await proxy.methods
    .exactOutput(
      callData,
      to,
      allowanceTarget,
      daiAddress,
      usdcAddress,
      sellAmountMax.toString(),
      outputAmount.toString()
    )
    .send({
      from: myWalletAddress,
      gas: 1000000,
      gasPrice: web3.utils.toWei("20", "gwei"),
    });

  console.log({ proxyHash: proxyHash.transactionHash });
  console.log(`*** Transaction has been sent`);
}

main()
  .then((data) => console.log(data))
  .catch((e) => console.log(e));
