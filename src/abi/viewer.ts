export const VIEWER_ABI = [
  {
    inputs: [],
    name: "BatchIsInSettlement",
    type: "error",
  },
  {
    inputs: [],
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [],
    name: "EpochNotEnded",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidShortString",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidTokenOrder",
    type: "error",
  },
  {
    inputs: [],
    name: "NotValidSettlementStep",
    type: "error",
  },
  {
    inputs: [],
    name: "OrderAlreadyClaimed",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "SignerNotMessageSender",
    type: "error",
  },
  {
    inputs: [],
    name: "SignerNotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "str",
        type: "string",
      },
    ],
    name: "StringTooLong",
    type: "error",
  },
  {
    inputs: [],
    name: "noCorrespondingFacet",
    type: "error",
  },
  {
    inputs: [],
    name: "notOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "EIP712DomainChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "tokenX",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenY",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
    ],
    name: "PoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
    ],
    name: "epochSettled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes4",
        name: "selector",
        type: "bytes4",
      },
      {
        indexed: false,
        internalType: "address",
        name: "facet",
        type: "address",
      },
    ],
    name: "facetAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "poolId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "epoch",
        type: "uint32",
      },
    ],
    name: "orderSubmitted",
    type: "event",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      {
        internalType: "bytes1",
        name: "fields",
        type: "bytes1",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "version",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "verifyingContract",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256[]",
        name: "extensions",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "publicKey",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct Permission",
        name: "permission",
        type: "tuple",
      },
    ],
    name: "getBalance",
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
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getUnclaimedOrder",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "poolId",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "epoch",
            type: "uint32",
          },
        ],
        internalType: "struct FugaziStorageLayout.unclaimedOrderStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUnclaimedOrdersLength",
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
];
