export const GiftFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_giftNFTImplementation',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ECDSAInvalidSignature',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    name: 'ECDSAInvalidSignatureLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 's',
        type: 'bytes32',
      },
    ],
    name: 'ECDSAInvalidSignatureS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EndTimestampInPast',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EnforcedPause',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EthTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExpectedPause',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedDeployment',
    type: 'error',
  },
  {
    inputs: [],
    name: 'IncorrectEthAmount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientEthBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InsufficientTokenBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidClaimCurrency',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidGiftID',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNFTImplementationAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidRecipientAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidShortString',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSignature',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'str',
        type: 'string',
      },
    ],
    name: 'StringTooLong',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TokensAndAmountsMismatch',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'EIP712DomainChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'giftId',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isPublic',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'claimEndTimestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokenAddresses',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenAmounts',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'giftMessage',
        type: 'string',
      },
    ],
    name: 'GiftCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipientAddress',
        type: 'address',
      },
    ],
    name: 'TokensRecovered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'giftId',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'tokenAddresses',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'TokensTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nftName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftDescription',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftImageURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_giftMessage',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contractURI',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_recipientAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_tokenAddresses',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_tokenAmounts',
        type: 'uint256[]',
      },
    ],
    name: 'createPrivateGift',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nftName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftDescription',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftImageURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_giftMessage',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contractURI',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_senderAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_recipientAddress',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_tokenAddresses',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: '_tokenAmounts',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'createPrivateGiftForSender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nftName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftDescription',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftImageURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_giftMessage',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contractURI',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_recipientAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_claimCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_claimPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_claimEndTimestamp',
        type: 'uint256',
      },
    ],
    name: 'createPublicGift',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_nftName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftDescription',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_nftImageURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_giftMessage',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_contractURI',
        type: 'string',
      },
      {
        internalType: 'address',
        name: '_senderAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_recipientAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_claimCurrency',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_claimPrice',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_claimEndTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_signature',
        type: 'bytes',
      },
    ],
    name: 'createPublicGiftForSender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      {
        internalType: 'bytes1',
        name: 'fields',
        type: 'bytes1',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'version',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'verifyingContract',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'salt',
        type: 'bytes32',
      },
      {
        internalType: 'uint256[]',
        name: 'extensions',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_giftId',
        type: 'address',
      },
    ],
    name: 'getGiftDetails',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'giftId',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'recipient',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isPublic',
            type: 'bool',
          },
          {
            internalType: 'address[]',
            name: 'tokenAddresses',
            type: 'address[]',
          },
          {
            internalType: 'uint256[]',
            name: 'tokenAmounts',
            type: 'uint256[]',
          },
        ],
        internalType: 'struct GiftFactory.GiftDetails',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
    ],
    name: 'getSenderNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'giftNFTImplementation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'giftRegistry',
    outputs: [
      {
        internalType: 'address',
        name: 'giftId',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isPublic',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nonces',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_sender',
        type: 'address',
      },
    ],
    name: 'predictNextNFTContractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'recoverTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
