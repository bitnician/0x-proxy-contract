import { Proxy, ERC20Test } from '../typechain';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Provider } from '@ethersproject/providers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';
import { data } from './shared';

describe('Poc', function () {
  let proxy: Proxy,
    usdc: ERC20Test,
    usdt: ERC20Test,
    uni: ERC20Test,
    dai: ERC20Test,
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

    const ProxyFactory = await ethers.getContractFactory('Proxy');
    proxy = (await ProxyFactory.deploy(zeroXAddress)) as Proxy;

    const USDCFactory = await ethers.getContractFactory('ERC20Test');
    usdc = USDCFactory.attach('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48') as ERC20Test;

    const USDTFactory = await ethers.getContractFactory('ERC20Test');
    usdt = USDTFactory.attach('0xdac17f958d2ee523a2206206994597c13d831ec7') as ERC20Test;

    const UniFactory = await ethers.getContractFactory('ERC20Test');
    uni = UniFactory.attach('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984') as ERC20Test;

    const DaiFactory = await ethers.getContractFactory('ERC20Test');
    dai = DaiFactory.attach('0x6B175474E89094C44Da98b954EedeAC495271d0F') as ERC20Test;

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

  it('exact output', async () => {
    this.timeout(100000);
    const outputTokenDecimals = 18;
    const outputAmount = BigNumber.from(10).mul(BigNumber.from(10).pow(outputTokenDecimals)); //uni

    const data =
      '0xd9627aa4000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000eddbe30d7ac55e7f30000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000006b175474e89094c44da98b954eedeac495271d0f0000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f984869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000797118abdc6177c065';

    const price = '27.151750422055270703'; // price uni(output) in terms of dai(input)
    const guaranteedPrice = '27.42326792627582341';

    console.log('diff', +guaranteedPrice - +price);
    console.log('slippage', (+guaranteedPrice - +price) * +outputAmount);

    const amountIn = +outputAmount * +price;
    const amountInMax = +outputAmount * +guaranteedPrice;

    await dai.connect(whale).approve(proxy.address, amountInMax.toString());

    await proxy
      .connect(whale)
      .proxyCallExactOutput(
        data,
        dai.address,
        uni.address,
        amountIn.toString(),
        amountInMax.toString(),
        outputAmount.toString()
      );
  });

  // it('test', async function () {
  //   this.timeout(100000);
  //   const amount = BigNumber.from(10).mul(BigNumber.from(10).pow(6));
  //   // https://api.0x.org/swap/v1/quote?buyToken=DAI&sellToken=USDC&sellAmount=${amount}

  //   const daiInitialBalance = await dai.balanceOf(proxy.address);

  //   const buyTokenDecimals = await dai.decimals();
  //   // const sellTokenDecimals = await usdc.decimals();
  //   // const amountOut = BigNumber.from(0.989319226599465122).mul(amount);

  //   const guaranteedAmount = 0.985536664544144967 * 10 ** parseInt(buyTokenDecimals.toString());
  //   console.log(guaranteedAmount.toString());

  //   // let price: any = 0.995491580347621179 * 10 ** parseInt(buyTokenDecimals.toFixed());

  //   // let userAmount = amount.div(BigNumber.from(10).pow(18)).mul(guaranteedPrice);
  //   // let treasuryAmount = amount.div(BigNumber.from(10).pow(18)).mul(price).sub(userAmount);

  //   // let userAmount = 10 * guaranteedPrice;
  //   // let totalAmount = 10 * price;
  //   // let treasuryAmount = 10 * price - userAmount;

  //   // console.log('userAmount', userAmount.toString());
  //   // console.log('totalAmount', totalAmount.toString());
  //   // console.log('treasuryAmount', treasuryAmount.toString());

  //   // await usdc.connect(whale).approve(proxy.address, amount);
  //   // await proxy.connect(whale).proxyCall(data, dai.address, usdc.address, amount, userAmount.toString());

  //   // const daiUpdatedBalance = await dai.balanceOf(proxy.address);

  //   // console.log('daiInitialBalance', daiInitialBalance.toString());
  //   // console.log('daiUpdatedBalance', daiUpdatedBalance.toString());
  // });
});
