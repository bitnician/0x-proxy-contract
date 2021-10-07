import { Poc, ERC20Test } from '../typechain';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Provider } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

describe('Poc', function () {
  let poc: Poc,
    usdc: ERC20Test,
    usdt: ERC20Test,
    uni: ERC20Test,
    provider: Provider,
    whale: SignerWithAddress,
    treasury: SignerWithAddress,
    admin: SignerWithAddress;
  before(async function () {
    this.timeout(100000);
    provider = ethers.provider;
    [treasury, admin] = await ethers.getSigners();
    const PocFactory = await ethers.getContractFactory('Poc');
    poc = (await PocFactory.deploy()) as Poc;

    const USDCFactory = await ethers.getContractFactory('ERC20Test');
    usdc = USDCFactory.attach('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') as ERC20Test;

    const USDTFactory = await ethers.getContractFactory('ERC20Test');
    usdt = USDTFactory.attach('0xdac17f958d2ee523a2206206994597c13d831ec7') as ERC20Test;

    const UniFactory = await ethers.getContractFactory('ERC20Test');
    uni = UniFactory.attach('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984') as ERC20Test;

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
  // it('testExactTokenForToken: usdc => usdt', async function () {
  //   this.timeout(100000);

  //   const initialBalanceWhaleUsdt = await usdt.balanceOf(whale.address);

  //   const amountIn = BigNumber.from(100).mul(1000000);
  //   const amountOutMin = BigNumber.from(70).mul(1000000);

  //   const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  //   const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

  //   const path = [USDC, USDT];

  //   await usdc.connect(whale).approve(poc.address, amountIn);

  //   await poc.connect(whale).testExactTokenForToken(amountIn, amountOutMin, path);

  //   const updatedBalanceWhaleUsdt = await usdt.balanceOf(whale.address);

  //   const pocUsdtBalance = await usdt.balanceOf(poc.address);

  //   console.log('pocUsdtBalance', pocUsdtBalance.toString());
  //   console.log('Diff of usdt balance of whale', updatedBalanceWhaleUsdt.sub(initialBalanceWhaleUsdt).toString());

  //   expect(amountOutMin).to.eq(updatedBalanceWhaleUsdt.sub(initialBalanceWhaleUsdt));
  // });
  // it('testExactTokenForToken: usdt => uni', async function () {
  //   this.timeout(100000);

  //   const initialBalanceWhaleUni = await uni.balanceOf(whale.address);

  //   const amountIn = BigNumber.from(100).mul(1000000);
  //   const amountOutMin = BigNumber.from(3).mul(BigNumber.from(10).pow(18));

  //   const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  //   const Uni = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

  //   const path = [USDT, Uni];

  //   await usdt.connect(whale).approve(poc.address, amountIn);

  //   await poc.connect(whale).testExactTokenForToken(amountIn, amountOutMin, path);

  //   const updatedBalanceWhaleUni = await uni.balanceOf(whale.address);

  //   const pocUniBalance = await uni.balanceOf(poc.address);

  //   console.log('pocUsdtBalance', pocUniBalance.toString());
  //   console.log('Diff of uni balance of whale', updatedBalanceWhaleUni.sub(initialBalanceWhaleUni).toString());

  //   expect(amountOutMin).to.eq(updatedBalanceWhaleUni.sub(initialBalanceWhaleUni));
  // });
  it('testTokenForExactToken', async function () {
    this.timeout(100000);

    const initialBalanceWhaleUsdt = await usdt.balanceOf(whale.address);
    const initialBalanceWhaleUsdc = await usdc.balanceOf(whale.address);

    const amountOut = BigNumber.from(100).mul(1000000);
    const amountInMax = BigNumber.from(110).mul(1000000);
    const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
    const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const path = [USDC, USDT];

    await usdc.connect(whale).approve(poc.address, amountInMax);

    console.log('initialBalanceWhaleUsdt', initialBalanceWhaleUsdt.toString());
    console.log('initialBalanceWhaleUsdc', initialBalanceWhaleUsdc.toString());

    await poc.connect(whale).testTokenForExactToken(amountOut, amountInMax, path);

    const updatedBalanceTreasury = await usdt.balanceOf(treasury.address);
    const updatedBalanceWhaleUsdt = await usdt.balanceOf(whale.address);
    const updatedBalanceWhaleUsdc = await usdc.balanceOf(whale.address);

    const pocUsdtBalance = await usdt.balanceOf(poc.address);

    console.log('updatedBalanceTreasury', updatedBalanceTreasury.toString());
    console.log('updatedBalanceWhaleUsdt', updatedBalanceWhaleUsdt.toString());
    console.log('updatedBalanceWhaleUsdc', updatedBalanceWhaleUsdc.toString());

    console.log('pocUsdtBalance', pocUsdtBalance.toString());

    console.log('Diff of usdt balance of whale', updatedBalanceWhaleUsdt.sub(initialBalanceWhaleUsdt).toString());
  });
});
