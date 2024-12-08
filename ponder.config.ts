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
    mainnet: {
      chainId: Number(process.env.CHAIN_ID),
      transport: http(process.env.PONDER_RPC_URL_466),
    },
  },

  contracts: {
    Gift: {
      network: 'mainnet',
      abi: GiftNftAbi,
      factory: {
        address: process.env.GIFT_FACTORY_ADDRESS as `0x${string}`,
        event: giftCreatedEvent,
        parameter: 'giftId',
      },
      startBlock: Number(process.env.START_BLOCK),
    },
    GiftFactory: {
      network: 'mainnet',
      address: process.env.GIFT_FACTORY_ADDRESS as `0x${string}`,
      abi: GiftFactoryAbi,
      startBlock: Number(process.env.START_BLOCK),
    },
  },
});
