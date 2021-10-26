//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.6;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IZeroX {
    function test() external;
}

contract Proxy {
    address zeroXAddress;

    constructor(address _zeroXAddress) {
        zeroXAddress = _zeroXAddress;
    }

    function proxyCallExactOutput(
        bytes memory data,
        address inputToken,
        address outputToken,
        uint256 amountIn,
        uint256 amountInMax,
        uint256 output
    ) external {
        IERC20(inputToken).transferFrom(msg.sender, address(this), amountInMax);

        IERC20(inputToken).approve(zeroXAddress, amountInMax);
        uint256 initialBalance = IERC20(inputToken).balanceOf(address(this));

        (bool success, ) = zeroXAddress.call(data);
        console.log(success);

        IERC20(outputToken).transfer(msg.sender, output);

        uint256 updatedBalance = IERC20(inputToken).balanceOf(address(this));

        console.log("initialBalance", initialBalance);
        console.log("updatedBalance", updatedBalance);
    }
}
