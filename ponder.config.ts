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
  },

  contracts: {
    Gift: {
      network: 'appchain',
      abi: GiftNftAbi,
      factory: {
        address: '0x46d06cdFF9C343433111EBA88A0a5F7C3658Ec9c',
        event: giftCreatedEvent,
        parameter: 'giftId',
      },
      startBlock: 59,
      //182
    },
    GiftFactory: {
      network: 'appchain',
      address: '0x46d06cdFF9C343433111EBA88A0a5F7C3658Ec9c',
      abi: GiftFactoryAbi,
      startBlock: 59,
    },
  },
});
