//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "./interfaces/IERC20.sol";
import "./libraries/SafeMath.sol";
import "./libraries/TransferHelper.sol";

contract Proxy {
    using SafeMath for *;
    using TransferHelper for address;

    address treasury;
    address seed;

    constructor(address _treasury, address _seed) {
        treasury = _treasury;
        seed = _seed;
    }

    function proxyCallExactOutput(
        bytes memory data,
        address callTarget,
        address allowanceTarget,
        address inputToken,
        address outputToken,
        uint256 amountInMax,
        uint256 outputAmount
    ) external {
        uint256 initialBalance = IERC20(inputToken).balanceOf(address(this));

        inputToken.safeTransferFrom(msg.sender, address(this), amountInMax);

        inputToken.safeApprove(allowanceTarget, amountInMax);

        (bool success, ) = callTarget.call(data);
        console.log(success);

        outputToken.safeTransfer(msg.sender, outputAmount);

        uint256 updatedBalance = IERC20(inputToken).balanceOf(address(this));

        uint256 excessSlippage = updatedBalance.sub(initialBalance);

        inputToken.safeTransfer(treasury, excessSlippage);

        // IERC20(seed).mint(msg.sender, excessSlippage);
    }

    function proxyCallExactInput(
        bytes memory data,
        address callTarget,
        address allowanceTarget,
        address inputToken,
        address outputToken,
        uint256 amountOut,
        uint256 amountOutMin,
        uint256 inputAmount
    ) external {
        uint256 initialBalance = IERC20(outputToken).balanceOf(address(this));

        inputToken.safeTransferFrom(msg.sender, address(this), inputAmount);

        inputToken.safeApprove(allowanceTarget, inputAmount);

        (bool success, ) = callTarget.call(data);
        console.log(success);

        outputToken.safeTransfer(msg.sender, amountOutMin);

        uint256 updatedBalance = IERC20(outputToken).balanceOf(address(this));

        uint256 excessSlippage = updatedBalance.sub(initialBalance);

        inputToken.safeTransfer(treasury, excessSlippage);

        // IERC20(seed).mint(msg.sender, excessSlippage);
    }
}
