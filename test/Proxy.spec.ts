import { Proxy, ERC20 } from '../typechain';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Provider } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { data } from './shared';
import axios from 'axios';
describe('Poc', function () {
  let proxy: Proxy,
    usdc: ERC20,
    usdt: ERC20,
    uni: ERC20,
    dai: ERC20,
    seed: ERC20,
    provider: Provider,
    whale: SignerWithAddress,
    treasury: SignerWithAddress,
    admin: SignerWithAddress,
    zeroXAddress: string,
    erc20Proxy: string;
  before(async function () {
    this.timeout(100000);
    provider = ethers.provider;
    [treasury, admin] = await ethers.getSigners();

    zeroXAddress = ethers.utils.getAddress('0xdef1c0ded9bec7f1a1670819833240f027b25eff');
    erc20Proxy = ethers.utils.getAddress('0x95E6F48254609A6ee006F7D493c8e5fB97094ceF');

    const SeedFactory = await ethers.getContractFactory('ERC20');
    seed = (await SeedFactory.deploy('Brokoli Seed', 'BRKS')) as ERC20;

    const ProxyFactory = await ethers.getContractFactory('Proxy');
    proxy = (await ProxyFactory.deploy(treasury.address, seed.address)) as Proxy;

    const USDCFactory = await ethers.getContractFactory('ERC20');
    usdc = USDCFactory.attach('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') as ERC20;

    const USDTFactory = await ethers.getContractFactory('ERC20');
    usdt = USDTFactory.attach('0xdac17f958d2ee523a2206206994597c13d831ec7') as ERC20;

    const UniFactory = await ethers.getContractFactory('ERC20');
    uni = UniFactory.attach('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984') as ERC20;

    const DaiFactory = await ethers.getContractFactory('ERC20');
    dai = DaiFactory.attach('0x6B175474E89094C44Da98b954EedeAC495271d0F') as ERC20;

    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: ['0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503'],
    });

    whale = (await ethers.getSigner('0x47ac0fb4f2d84898e4d9e7b4dab3c24507a6d503')) as SignerWithAddress;

    await admin.sendTransaction({
      to: whale.address,
      value: ethers.utils.parseEther('100'),
    });
  });

  // it('exact output', async () => {
  //   this.timeout(100000);
  //   //https://api.0x.org/swap/v1/quote?buyToken=uni&sellToken=dai&buyAmount=10000000000000000000

  //   const inputToken = 'dai';
  //   const outputToken = 'uni';
  //   const outputTokenDecimals = 18;
  //   const outputAmount = BigNumber.from(10).mul(BigNumber.from(10).pow(outputTokenDecimals)); //uni

  //   const { data } = await axios.get(
  //     `https://api.0x.org/swap/v1/quote?buyToken=${outputToken}&sellToken=${inputToken}&buyAmount=${+outputAmount}`
  //   );

  //   const { price, guaranteedPrice, allowanceTarget, to, data: callData } = data;

  //   const amountIn = +outputAmount * +price;
  //   const amountInMax = +outputAmount * +guaranteedPrice;

  //   await dai.connect(whale).approve(proxy.address, amountInMax.toString());

  //   await proxy
  //     .connect(whale)
  //     .proxyCallExactOutput(
  //       callData,
  //       to,
  //       allowanceTarget,
  //       dai.address,
  //       uni.address,
  //       amountInMax.toString(),
  //       outputAmount.toString()
  //     );
  // });

  it('exact input', async () => {
    this.timeout(100000);

    const inputToken = 'dai';
    const outputToken = 'uni';
    const inputTokenDecimals = 18;
    const inputAmount = BigNumber.from(10).mul(BigNumber.from(10).pow(inputTokenDecimals)); //dai

    const { data } = await axios.get(
      `https://api.0x.org/swap/v1/quote?buyToken=${outputToken}&sellToken=${inputToken}&sellAmount=${+inputAmount}`
    );

    // https://api.0x.org/swap/v1/quote?buyToken=uni&sellToken=dai&sellAmount=10000000000000000000

    const { price, guaranteedPrice, allowanceTarget, to, data: callData } = data;

    const amountOut = +inputAmount * +price;
    const amountOutMin = +inputAmount * +guaranteedPrice;

    await dai.connect(whale).approve(proxy.address, inputAmount.toString());

    await proxy
      .connect(whale)
      .proxyCallExactInput(
        callData,
        to,
        allowanceTarget,
        dai.address,
        uni.address,
        amountOutMin.toString(),
        inputAmount.toString()
      );
  });
});
