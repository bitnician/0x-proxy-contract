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
  "https://kovan.infura.io/v3/1b224486b8a1474cad650814061e0611"
);

const proxyAddress = "0xB1D3f1E09a1f4f5120eF73612c04D22A22c63c4D";
const daiAddress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa";
const usdcAddress = "0xb7a4F3E9097C08dA09517b5aB877F7a917224ede";

const privateKey =
  "28234ed7decda909b9e27d6417246fc3b8eba5eec6c57f22318cbb18511aff97";

web3.eth.accounts.wallet.add("0x" + privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;

const proxy = new web3.eth.Contract(proxyAbi, proxyAddress);
const daiToken = new web3.eth.Contract(tokenAbi, daiAddress);
const usdcToken = new web3.eth.Contract(tokenAbi, usdcAddress);

async function main() {
  const sellToken = daiAddress;
  const buyToken = usdcAddress;
  const sellTokenDecimals = 18;

  const inputAmount = new BigNumber(1).times(
    new BigNumber(10).pow(sellTokenDecimals)
  ); //uni

  const { data } = await axios.get(
    `https://kovan.api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${+inputAmount}`
  );
  console.log(
    `https://kovan.api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${+inputAmount}`
  );
  const {
    guaranteedPrice,
    allowanceTarget,
    to,
    data: callData,
    sellAmount,
  } = data;

  const gPriceBN = new BN(guaranteedPrice.replace(".", ""));
  const sAmountBN = new BN(sellAmount);
  let buyAmountMin = new BN(0);

  const multiplier = new BN("10").pow(new BN(sellTokenDecimals));
  buyAmountMin = sAmountBN.mul(gPriceBN).div(multiplier);

  console.log({
    usdcBuyAmount: buyAmountMin.toString(),
    daiSellAmount: sAmountBN.toString(),
  });

  const approveHash = await daiToken.methods
    .approve(proxyAddress, inputAmount.toString())
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
    .exactSell(
      callData,
      to,
      allowanceTarget,
      daiAddress,
      usdcAddress,
      buyAmountMin.toString(),
      inputAmount.toString()
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
  .then((data) => console.log())
  .catch((e) => console.log(e));
