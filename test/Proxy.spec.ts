import { Proxy0x, ERC20 } from "../typechain";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Provider } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { BigNumber } from 'ethers';
import { BigNumber } from "bignumber.js";
import { data } from "./shared";
import axios from "axios";
import { BN } from "bn.js";
import { Wallet } from "@ethersproject/wallet";
describe("Poc", function () {
  let proxy: Proxy0x,
    usdc: ERC20,
    usdt: ERC20,
    uni: ERC20,
    dai: ERC20,
    seed: ERC20,
    provider: Provider,
    whale: SignerWithAddress,
    treasury: SignerWithAddress,
    admin: SignerWithAddress,
    zeroXAddress: string;

  before(async function () {
    this.timeout(100000);
    provider = ethers.provider;
    [treasury, admin] = await ethers.getSigners();

    zeroXAddress = ethers.utils.getAddress(
      "0xdef1c0ded9bec7f1a1670819833240f027b25eff"
    );

    const SeedFactory = await ethers.getContractFactory("ERC20");
    seed = (await SeedFactory.deploy("Brokoli Seed", "BRKS")) as ERC20;

    const ProxyFactory = await ethers.getContractFactory("Proxy0x");
    proxy = (await ProxyFactory.deploy(
      treasury.address,
      seed.address
    )) as Proxy0x;

    const USDCFactory = await ethers.getContractFactory("ERC20");
    usdc = USDCFactory.attach(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    ) as ERC20;

    const USDTFactory = await ethers.getContractFactory("ERC20");
    usdt = USDTFactory.attach(
      "0xdac17f958d2ee523a2206206994597c13d831ec7"
    ) as ERC20;

    const UniFactory = await ethers.getContractFactory("ERC20");
    uni = UniFactory.attach(
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    ) as ERC20;

    const DaiFactory = await ethers.getContractFactory("ERC20");
    dai = DaiFactory.attach(
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    ) as ERC20;

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"],
    });

    whale = (await ethers.getSigner(
      "0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503"
    )) as SignerWithAddress;

    await admin.sendTransaction({
      to: whale.address,
      value: ethers.utils.parseEther("100"),
    });
  });

  it("exact output: dai => uni", async function () {
    this.timeout(100000);

    const sellToken = "dai";
    const buyToken = "uni";
    const buyTokenDecimals = 18;
    const outputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(buyTokenDecimals)
    ); //uni

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&buyAmount=${+outputAmount}`
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
    let sellAmountMax = new BN(0);

    const multiplier = new BN("10").pow(new BN(buyTokenDecimals));
    sellAmountMax = bAmountBN.mul(gPriceBN).div(multiplier);

    console.log({
      uniBuyAmount: bAmountBN.toString(),
      daiSellAmount: sellAmountMax.toString(),
    });

    await dai.connect(whale).approve(proxy.address, sellAmountMax.toString());

    await proxy
      .connect(whale)
      .proxyCallExactOutput(
        callData,
        to,
        allowanceTarget,
        dai.address,
        uni.address,
        sellAmountMax.toString(),
        outputAmount.toString()
      );
  });
  it("exact output : usdc => uni", async function () {
    this.timeout(100000);

    const sellToken = "usdc";
    const buyToken = "uni";
    const buyTokenDecimals = 18;
    const outputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(buyTokenDecimals)
    ); //uni

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&buyAmount=${+outputAmount}`
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
    let sellAmountMax = new BN(0);

    const multiplier = new BN("10").pow(new BN(buyTokenDecimals));
    sellAmountMax = bAmountBN.mul(gPriceBN).div(multiplier);

    console.log({
      uniBuyAmount: bAmountBN.toString(),
      usdcSellAmount: sellAmountMax.toString(),
    });

    await usdc.connect(whale).approve(proxy.address, sellAmountMax.toString());

    await proxy
      .connect(whale)
      .proxyCallExactOutput(
        callData,
        to,
        allowanceTarget,
        usdc.address,
        uni.address,
        sellAmountMax.toString(),
        outputAmount.toString()
      );
  });
  it("exact output : uni => usdc", async function () {
    this.timeout(100000);

    const sellToken = "uni";
    const buyToken = "usdc";
    const buyTokenDecimals = 6;
    const outputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(buyTokenDecimals)
    ); //uni

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&buyAmount=${+outputAmount}`
    );

    const {
      guaranteedPrice,
      allowanceTarget,
      to,
      data: callData,
      buyAmount,
    } = data;

    const decimals = guaranteedPrice.split(".")[1]?.length || 0;

    const gPriceBN = new BN(guaranteedPrice.replace(".", ""));
    const bAmountBN = new BN(buyAmount);
    let sellAmountMax = new BN(0);

    const multiplier = new BN("10").pow(new BN(buyTokenDecimals));
    sellAmountMax = bAmountBN.mul(gPriceBN).div(multiplier);

    console.log({
      usdcBuyAmount: bAmountBN.toString(),
      uniSellAmount: sellAmountMax.toString(),
    });

    await uni.connect(whale).approve(proxy.address, sellAmountMax.toString());

    await proxy
      .connect(whale)
      .proxyCallExactOutput(
        callData,
        to,
        allowanceTarget,
        uni.address,
        usdc.address,
        sellAmountMax.toString(),
        outputAmount.toString()
      );
  });

  it("exact input, dai => uni", async function () {
    this.timeout(100000);

    const sellToken = "dai";
    const buyToken = "uni";
    const sellTokenDecimals = 18;
    const inputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(sellTokenDecimals)
    ); //dai

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${+inputAmount}`
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
      uniBuyAmount: buyAmountMin.toString(),
      daiSellAmount: sAmountBN.toString(),
    });

    await dai.connect(whale).approve(proxy.address, inputAmount.toString());

    await proxy
      .connect(whale)
      .proxyCallExactInput(
        callData,
        to,
        allowanceTarget,
        dai.address,
        uni.address,
        buyAmountMin.toString(),
        inputAmount.toString()
      );
  });
  it("exact input, usdc => uni", async function () {
    this.timeout(100000);

    const sellToken = "usdc";
    const buyToken = "uni";
    const sellTokenDecimals = 6;
    const inputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(sellTokenDecimals)
    );

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${+inputAmount}`
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
      uniBuyAmount: buyAmountMin.toString(),
      usdcSellAmount: sAmountBN.toString(),
    });

    await usdc.connect(whale).approve(proxy.address, inputAmount.toString());

    await proxy
      .connect(whale)
      .proxyCallExactInput(
        callData,
        to,
        allowanceTarget,
        usdc.address,
        uni.address,
        buyAmountMin.toString(),
        inputAmount.toString()
      );
  });
  it("exact input, uni => usdc", async function () {
    this.timeout(100000);

    const sellToken = "uni";
    const buyToken = "usdc";
    const sellTokenDecimals = 18;

    const inputAmount = new BigNumber(10).times(
      new BigNumber(10).pow(sellTokenDecimals)
    ); //uni

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${+inputAmount}`
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
      uniSellAmount: sAmountBN.toString(),
    });

    await uni.connect(whale).approve(proxy.address, inputAmount.toString());

    await proxy
      .connect(whale)
      .proxyCallExactInput(
        callData,
        to,
        allowanceTarget,
        uni.address,
        usdc.address,
        buyAmountMin.toString(),
        inputAmount.toString()
      );
  });
});
