/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { ERC20 } from "./ERC20";

export class ERC20Factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides
  ): Promise<ERC20> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC20>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ERC20 {
    return super.attach(address) as ERC20;
  }
  connect(signer: Signer): ERC20Factory {
    return super.connect(signer) as ERC20Factory;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC20 {
    return new Contract(address, _abi, signerOrProvider) as ERC20;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000ec438038062000ec48339810160408190526200003491620001b9565b81516200004990600390602085019062000068565b5080516200005f90600490602084019062000068565b50505062000273565b828054620000769062000220565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b600082601f8301126200011f578081fd5b81516001600160401b03808211156200013c576200013c6200025d565b6040516020601f8401601f19168201810183811183821017156200016457620001646200025d565b60405283825285840181018710156200017b578485fd5b8492505b838310156200019e57858301810151828401820152918201916200017f565b83831115620001af57848185840101525b5095945050505050565b60008060408385031215620001cc578182fd5b82516001600160401b0380821115620001e3578384fd5b620001f1868387016200010e565b9350602085015191508082111562000207578283fd5b5062000216858286016200010e565b9150509250929050565b6002810460018216806200023557607f821691505b602082108114156200025757634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b610c4180620002836000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c80633950935111610081578063a457c2d71161005b578063a457c2d714610177578063a9059cbb1461018a578063dd62ed3e1461019d576100c9565b8063395093511461014957806370a082311461015c57806395d89b411461016f576100c9565b806318160ddd116100b257806318160ddd1461010c57806323b872dd14610121578063313ce56714610134576100c9565b806306fdde03146100ce578063095ea7b3146100ec575b600080fd5b6100d66101b0565b6040516100e39190610890565b60405180910390f35b6100ff6100fa36600461085c565b610242565b6040516100e39190610885565b61011461025f565b6040516100e39190610b8c565b6100ff61012f366004610821565b610265565b61013c61033f565b6040516100e39190610b95565b6100ff61015736600461085c565b610344565b61011461016a3660046107ce565b6103a5565b6100d66103d1565b6100ff61018536600461085c565b6103e0565b6100ff61019836600461085c565b610480565b6101146101ab3660046107ef565b610494565b6060600380546101bf90610be0565b80601f01602080910402602001604051908101604052809291908181526020018280546101eb90610be0565b80156102385780601f1061020d57610100808354040283529160200191610238565b820191906000526020600020905b81548152906001019060200180831161021b57829003601f168201915b5050505050905090565b600061025661024f6104cc565b84846104d0565b50600192915050565b60025490565b60006102728484846105df565b73ffffffffffffffffffffffffffffffffffffffff84166000908152600160205260408120816102a06104cc565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905082811015610320576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031790610a18565b60405180910390fd5b6103348561032c6104cc565b8584036104d0565b506001949350505050565b601290565b60006102566103516104cc565b84846001600061035f6104cc565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918b16815292529020546103a09190610ba3565b6104d0565b73ffffffffffffffffffffffffffffffffffffffff81166000908152602081905260409020545b919050565b6060600480546101bf90610be0565b600080600160006103ef6104cc565b73ffffffffffffffffffffffffffffffffffffffff90811682526020808301939093526040918201600090812091881681529252902054905082811015610462576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031790610b2f565b61047661046d6104cc565b858584036104d0565b5060019392505050565b600061025661048d6104cc565b84846105df565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b3390565b73ffffffffffffffffffffffffffffffffffffffff831661051d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031790610ad2565b73ffffffffffffffffffffffffffffffffffffffff821661056a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103179061095e565b73ffffffffffffffffffffffffffffffffffffffff80841660008181526001602090815260408083209487168084529490915290819020849055517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925906105d2908590610b8c565b60405180910390a3505050565b73ffffffffffffffffffffffffffffffffffffffff831661062c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031790610a75565b73ffffffffffffffffffffffffffffffffffffffff8216610679576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161031790610901565b6106848383836107a5565b73ffffffffffffffffffffffffffffffffffffffff8316600090815260208190526040902054818110156106e4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610317906109bb565b73ffffffffffffffffffffffffffffffffffffffff808516600090815260208190526040808220858503905591851681529081208054849290610728908490610ba3565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161078c9190610b8c565b60405180910390a361079f8484846107a5565b50505050565b505050565b803573ffffffffffffffffffffffffffffffffffffffff811681146103cc57600080fd5b6000602082840312156107df578081fd5b6107e8826107aa565b9392505050565b60008060408385031215610801578081fd5b61080a836107aa565b9150610818602084016107aa565b90509250929050565b600080600060608486031215610835578081fd5b61083e846107aa565b925061084c602085016107aa565b9150604084013590509250925092565b6000806040838503121561086e578182fd5b610877836107aa565b946020939093013593505050565b901515815260200190565b6000602080835283518082850152825b818110156108bc578581018301518582016040015282016108a0565b818111156108cd5783604083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016929092016040019392505050565b60208082526023908201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260408201527f6573730000000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526022908201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560408201527f7373000000000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526026908201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260408201527f616c616e63650000000000000000000000000000000000000000000000000000606082015260800190565b60208082526028908201527f45524332303a207472616e7366657220616d6f756e742065786365656473206160408201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000606082015260800190565b60208082526025908201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460408201527f6472657373000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526024908201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460408201527f7265737300000000000000000000000000000000000000000000000000000000606082015260800190565b60208082526025908201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760408201527f207a65726f000000000000000000000000000000000000000000000000000000606082015260800190565b90815260200190565b60ff91909116815260200190565b60008219821115610bdb577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b500190565b600281046001821680610bf457607f821691505b60208210811415610c2e577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b5091905056fea164736f6c6343000800000a";
