// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/uniswap.sol";
import "hardhat/console.sol";

interface IUniswapV2Callee {
    function uniswapV2Call(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}

contract Poc is IUniswapV2Callee {
    using SafeERC20 for IERC20;

    // Uniswap V2 Router
    address private constant ROUTER =
        0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    // Uniswap V2 factory
    address private constant FACTORY =
        0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;

    //Test exactTokensForTokens
    function testExactTokenForToken(
        uint256 _amountIn,
        uint256 _amountOutMin,
        address[] memory _path
    ) public {
        console.log("_amountIn", _amountIn);
        console.log("_amountOutMin", _amountOutMin);
        console.log("tokenIn", _path[0]);
        console.log("tokenOut", _path[1]);

        address pair = IUniswapV2Factory(FACTORY).getPair(_path[0], _path[1]);
        require(pair != address(0), "!pair");

        uint256[] memory amounts = IUniswapV2Router(ROUTER).getAmountsOut(
            _amountIn,
            _path
        );

        require(
            amounts[amounts.length - 1] >= _amountOutMin,
            "amount out is low"
        );

        uint256 excessSlippage = amounts[amounts.length - 1] - _amountOutMin;

        console.log("pair", pair);
        console.log("amountOut", amounts[amounts.length - 1]);
        console.log("excessSlippage", excessSlippage);

        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint256 amount0Out = _path[1] == token0
            ? amounts[amounts.length - 1]
            : 0;
        uint256 amount1Out = _path[1] == token1
            ? amounts[amounts.length - 1]
            : 0;

        console.log("amount0Out", amount0Out);
        console.log("amount1Out", amount1Out);
        console.log("address(this)", address(this));
        console.log("msg.sender", msg.sender);

        IERC20(_path[0]).safeTransferFrom(msg.sender, pair, _amountIn);

        bytes memory data = abi.encode(
            _path[_path.length - 1],
            msg.sender,
            _amountOutMin
        );

        IUniswapV2Pair(pair).swap(amount0Out, amount1Out, address(this), data);
    }

    //Test exactTokensForTokens
    function testTokenForExactToken(
        uint256 _amountOut,
        uint256 _amountInMax,
        address[] memory _path
    ) public {
        console.log("_amountOut", _amountOut);
        console.log("_amountInMax", _amountInMax);
        console.log("tokenIn", _path[0]);
        console.log("tokenOut", _path[1]);

        address pair = IUniswapV2Factory(FACTORY).getPair(_path[0], _path[1]);
        require(pair != address(0), "!pair");

        uint256[] memory amounts = IUniswapV2Router(ROUTER).getAmountsIn(
            _amountOut,
            _path
        );

        require(_amountInMax >= amounts[0], "amount out is low");

        uint256 excessSlippage = _amountInMax - amounts[0];

        console.log("pair", pair);
        console.log("amountIn", amounts[0]);
        console.log("excessSlippage", excessSlippage);

        IERC20(_path[0]).safeTransferFrom(msg.sender, pair, _amountInMax);

        address token0 = IUniswapV2Pair(pair).token0();
        address token1 = IUniswapV2Pair(pair).token1();
        uint256 amount0Out = _path[1] == token0
            ? amounts[amounts.length - 1]
            : 0;
        uint256 amount1Out = _path[1] == token1
            ? amounts[amounts.length - 1]
            : 0;

        console.log("amount0Out", amount0Out);
        console.log("amount1Out", amount1Out);
        console.log("address(this)", address(this));
        console.log("msg.sender", msg.sender);

        bytes memory data = abi.encode(
            _path[_path.length - 1],
            msg.sender,
            amount1Out
        );

        IUniswapV2Pair(pair).swap(
            amount0Out,
            amount1Out + 1,
            address(this),
            data
        );
    }

    // called by pair contract
    function uniswapV2Call(
        address _sender,
        uint256 _amount0,
        uint256 _amount1,
        bytes calldata _data
    ) external override {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(FACTORY).getPair(token0, token1);
        require(msg.sender == pair, "!pair");

        console.log("msg.sender of uniswapV2Call", msg.sender);

        (address token, address user, uint256 amountOut) = abi.decode(
            _data,
            (address, address, uint256)
        );

        console.log("user", user);
        console.log("amountOut", amountOut);
        console.log("token", token);

        IERC20(token).safeTransfer(user, amountOut);
    }
}
