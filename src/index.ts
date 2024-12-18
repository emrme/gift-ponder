import { Context, ponder } from '@/generated';
import { createThirdwebClient } from 'thirdweb';
import { download } from 'thirdweb/storage';
import { Address, ContractFunctionExecutionError } from 'viem';
import { GiftNftAbi } from '../abis/gift-nft-abi';

import { gift, mint, user } from '../ponder.schema';

type ContractMetadata = {
  senderName: string;
  recipientName: string;
};

const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const HOURS = 60 * 60 * 1000;

const CACHE_CONFIG = {
  TTL: {
    USER: 48 * HOURS,
    CONTRACT_METADATA: 24 * HOURS,
    SHARED_METADATA: 24 * HOURS,
    CONTRACT_URI: 24 * HOURS,
    OWNER: 48 * HOURS,
  },
  MAX_SIZE: {
    USER: 50_000,
    CONTRACT_METADATA: 10_000,
    SHARED_METADATA: 25_000,
    CONTRACT_URI: 25_000,
    OWNER: 50_000,
  },
};

const createMemoizedFunction = <T>(
  fn: (...args: any[]) => Promise<T>,
  keyFn: (...args: any[]) => string,
  options: {
    maxSize?: number;
    ttl?: number;
  } = {}
) => {
  const cache = new Map<string, { value: T; timestamp: number }>();

  return async (...args: any[]): Promise<T> => {
    const key = keyFn(...args);
    const cached = cache.get(key);

    if (
      cached &&
      (!options.ttl || Date.now() - cached.timestamp < options.ttl)
    ) {
      return cached.value;
    }

    const value = await fn(...args);
    cache.set(key, { value, timestamp: Date.now() });

    if (options.maxSize && cache.size > options.maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    return value;
  };
};

const getOrCreateUser = createMemoizedFunction(
  async (context: Context, address: Address) => {
    const normalizedAddress = address.toLowerCase() as `0x${string}`;

    let _user = await context.db.find(user, { id: normalizedAddress });
    if (_user) return _user;

    try {
      _user = await context.db.insert(user).values({
        id: normalizedAddress,
        address: normalizedAddress,
      });
      return _user;
    } catch (error: any) {
      if (
        error.message?.includes('unique constraint') ||
        error.message?.includes('duplicate key')
      ) {
        _user = await context.db.find(user, { id: normalizedAddress });
        if (_user) return _user;
      }
      throw error;
    }
  },
  (context: Context, address: Address) => address.toLowerCase(),
  { maxSize: CACHE_CONFIG.MAX_SIZE.USER, ttl: CACHE_CONFIG.TTL.USER }
);

const getContractMetadata = createMemoizedFunction(
  async (contractUri: string): Promise<ContractMetadata> => {
    const contractMetadataResponse = await download({
      client,
      uri: contractUri,
    });
    return (await contractMetadataResponse.json()) as ContractMetadata;
  },
  (contractUri: string) => contractUri,
  {
    maxSize: CACHE_CONFIG.MAX_SIZE.CONTRACT_METADATA,
    ttl: CACHE_CONFIG.TTL.CONTRACT_METADATA,
  }
);

const getSharedMetadata = createMemoizedFunction(
  async (context: Context, giftId: Address) => {
    return await context.client.readContract({
      address: giftId,
      abi: GiftNftAbi,
      functionName: 'sharedMetadata',
    });
  },
  (context: Context, giftId: Address) => giftId.toLowerCase(),
  {
    maxSize: CACHE_CONFIG.MAX_SIZE.SHARED_METADATA,
    ttl: CACHE_CONFIG.TTL.SHARED_METADATA,
  }
);

const getContractUri = createMemoizedFunction(
  async (context: Context, giftId: Address) => {
    return await context.client.readContract({
      address: giftId,
      abi: GiftNftAbi,
      functionName: 'contractURI',
    });
  },
  (context: Context, giftId: Address) => giftId.toLowerCase(),
  {
    maxSize: CACHE_CONFIG.MAX_SIZE.CONTRACT_URI,
    ttl: CACHE_CONFIG.TTL.CONTRACT_URI,
  }
);

const getOwner = createMemoizedFunction(
  async (context: Context, giftId: Address) => {
    return await context.client.readContract({
      address: giftId,
      abi: GiftNftAbi,
      functionName: 'owner',
    });
  },
  (context: Context, giftId: Address) => giftId.toLowerCase(),
  { maxSize: CACHE_CONFIG.MAX_SIZE.OWNER, ttl: CACHE_CONFIG.TTL.OWNER }
);

ponder.on('GiftFactory:GiftCreated', async ({ event, context }) => {
  console.log(
    `GiftCreated: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  try {
    const [sender, recipient] = await Promise.all([
      getOrCreateUser(context, event.args.sender),
      getOrCreateUser(context, event.args.recipient),
    ]);

    const giftId = event.args.giftId;

    // Batch contract reads
    const [sharedMetadata, contractUri] = await Promise.all([
      getSharedMetadata(context, giftId),
      getContractUri(context, giftId),
    ]);

    const [title, description, imageUri] = sharedMetadata;

    const contractMetadata = await getContractMetadata(contractUri);

    await context.db.insert(gift).values({
      id: giftId,
      senderId: sender.id,
      recipientId: recipient.id,
      isPublic: event.args.isPublic,
      claimEndTimestamp: event.args.claimEndTimestamp,
      tokenAddresses: [...event.args.tokenAddresses],
      tokenAmounts: [...event.args.tokenAmounts],
      giftMessage: event.args.giftMessage,
      title,
      description,
      imageUri,
      senderName: contractMetadata.senderName,
      recipientName: contractMetadata.recipientName,
      timestamp: event.block.timestamp,
      chainId: BigInt(context.network.chainId),
      mintCount: 1,
      lastMintTimestamp: event.block.timestamp,
    });
  } catch (error) {
    if (error instanceof ContractFunctionExecutionError) {
      console.error('Contract call failed:', error.message);
    } else {
      console.error('Error processing GiftCreated:', error);
    }
    throw error;
  }
});

ponder.on('Gift:TokensClaimed', async ({ event, context }) => {
  console.log(
    `TokensClaimed: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  try {
    const giftId = event.log.address.toLowerCase() as `0x${string}`;

    const [
      [claimer, recipient],
      sharedMetadata,
      ownerAddress,
      contractUri,
      _gift,
    ] = await Promise.all([
      Promise.all([
        getOrCreateUser(context, event.args.claimer),
        getOrCreateUser(context, event.args.receiver),
      ]),
      getSharedMetadata(context, giftId),
      getOwner(context, giftId),
      getContractUri(context, giftId),
      context.db.find(gift, { id: giftId }),
    ]);

    const owner = await getOrCreateUser(context, ownerAddress);
    const [title, description, imageUri] = sharedMetadata;

    const contractMetadata = await getContractMetadata(contractUri);

    const mintData = {
      id: `${giftId}-${event.args.startTokenId}`,
      giftId,
      claimConditionIndex: event.args.claimConditionIndex,
      claimerId: claimer.id,
      senderId: owner.id,
      recipientId: recipient.id,
      startTokenId: event.args.startTokenId,
      quantityClaimed: event.args.quantityClaimed,
      timestamp: event.block.timestamp,
      chainId: BigInt(context.network.chainId),
      claimEndTimestamp: _gift?.claimEndTimestamp,
      title,
      description,
      imageUri,
      message: '',
      senderName: contractMetadata.senderName,
      recipientName: contractMetadata.recipientName,
    };

    if (_gift) {
      await context.db.update(gift, { id: giftId }).set({
        mintCount: _gift.mintCount + 1,
        lastMintTimestamp: event.block.timestamp,
      });
    }

    await context.db.insert(mint).values(mintData);
  } catch (error) {
    console.error('Error processing TokensClaimed:', error);
    throw error;
  }
});

ponder.on('Gift:MessageAdded', async ({ event, context }) => {
  console.log(
    `MessageAdded: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  try {
    const giftId = event.log.address.toLowerCase() as `0x${string}`;
    const mintId = `${giftId}-${event.args.firstTokenId}`;

    const _gift = await context.db.find(gift, { id: giftId });

    if (_gift) {
      await Promise.all([
        context.db.update(gift, { id: giftId }).set({
          messageCount: _gift.messageCount + 1,
        }),
        context.db.update(mint, { id: mintId }).set({
          message: event.args.message,
        }),
      ]);
    }
  } catch (error) {
    console.error('Error processing MessageAdded:', error);
    throw error;
  }
});
