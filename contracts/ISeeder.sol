// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface ISeeder {
    function seedPerFee(address feeToken) external view returns (uint256);

    function issueSeeds(
        address recipient,
        address feeToken,
        uint256 feeAmount
    ) external;
}
