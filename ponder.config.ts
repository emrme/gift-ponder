import { createConfig } from '@ponder/core';
import { parseAbiItem } from 'abitype';
import { http } from 'viem';
import { GiftFactoryAbi } from './abis/gift-factory-abi';
import { GiftNftAbi } from './abis/gift-nft-abi';

const giftCreatedEvent = parseAbiItem(
  'event GiftCreated(address indexed giftId, address indexed sender, address indexed recipient, bool isPublic, uint256 claimEndTimestamp, address[] tokenAddresses, uint256[] tokenAmounts, string giftMessage)'
);

export default createConfig({
  networks: {
    appchain: {
      chainId: 466,
      transport: http(process.env.PONDER_RPC_URL_466),
    },
    'base-sepolia': {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532),
    },
  },

  contracts: {
    Gift: {
      network: {
        appchain: {
          factory: {
            address: '0x46d06cdFF9C343433111EBA88A0a5F7C3658Ec9c',
            event: giftCreatedEvent,
            parameter: 'giftId',
          },
          startBlock: 59,
        },
        'base-sepolia': {
          factory: {
            address: '0xa562225397B382644a96a9122ee1c2f779B460e6',
            event: giftCreatedEvent,
            parameter: 'giftId',
          },
          startBlock: 16438562,
        },
      },
      abi: GiftNftAbi,
    },
    GiftFactory: {
      network: {
        appchain: {
          address: '0x46d06cdFF9C343433111EBA88A0a5F7C3658Ec9c',
          startBlock: 59,
        },
        'base-sepolia': {
          address: '0xa562225397B382644a96a9122ee1c2f779B460e6',
          startBlock: 16438562,
        },
      },
      abi: GiftFactoryAbi,
    },
  },
});
