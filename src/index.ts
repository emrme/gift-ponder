import { Context, ponder } from '@/generated';
import { createThirdwebClient } from 'thirdweb';
import { download } from 'thirdweb/storage';
import { Address } from 'viem';
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

async function getOrCreateUser(context: Context, address: Address) {
  const normalizedAddress = address.toLowerCase() as `0x${string}`;

  const _user = await context.db.find(user, { id: normalizedAddress });

  if (!_user) {
    return await context.db.insert(user).values({
      id: normalizedAddress,
      address: normalizedAddress,
    });
  }

  return _user;
}

ponder.on('GiftFactory:GiftCreated', async ({ event, context }) => {
  console.log(
    `GiftCreated: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  const sender = await getOrCreateUser(context, event.args.sender);
  const recipient = await getOrCreateUser(context, event.args.recipient);
  const giftId = event.args.giftId;

  const sharedMetadata = await context.client.readContract({
    address: giftId,
    abi: GiftNftAbi,
    functionName: 'sharedMetadata',
  });

  const [title, description, imageUri] = sharedMetadata;
  const contractUri = await context.client.readContract({
    address: giftId,
    abi: GiftNftAbi,
    functionName: 'contractURI',
  });

  const contractMetadataResponse = await download({
    client,
    uri: contractUri,
  });

  const contractMetadata =
    (await contractMetadataResponse.json()) as ContractMetadata;

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
});

ponder.on('Gift:TokensClaimed', async ({ event, context }) => {
  console.log(
    `TokensClaimed: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  const claimer = await getOrCreateUser(context, event.args.claimer);
  const recipient = await getOrCreateUser(context, event.args.receiver);
  const giftId = event.log.address.toLowerCase() as `0x${string}`;

  const sharedMetadata = await context.client.readContract({
    address: giftId,
    abi: GiftNftAbi,
    functionName: 'sharedMetadata',
  });

  const ownerAddress = await context.client.readContract({
    address: giftId,
    abi: GiftNftAbi,
    functionName: 'owner',
  });

  const owner = await getOrCreateUser(context, ownerAddress);
  const [title, description, imageUri] = sharedMetadata;

  const contractUri = await context.client.readContract({
    address: giftId,
    abi: GiftNftAbi,
    functionName: 'contractURI',
  });

  const contractMetadataResponse = await download({
    client,
    uri: contractUri,
  });
  const contractMetadata =
    (await contractMetadataResponse.json()) as ContractMetadata;

  const _gift = await context.db.find(gift, { id: giftId });

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
});

ponder.on('Gift:MessageAdded', async ({ event, context }) => {
  console.log(
    `MessageAdded: ${event.log.address}`,
    context.network.chainId,
    event.block.number
  );

  const mintId = `${event.log.address.toLowerCase()}-${
    event.args.firstTokenId
  }`;

  const giftId = event.log.address.toLowerCase() as `0x${string}`;

  const _gift = await context.db.find(gift, { id: giftId });

  if (_gift) {
    await context.db.update(gift, { id: giftId }).set({
      messageCount: _gift.messageCount + 1,
    });
  }

  await context.db
    .update(mint, { id: mintId })
    .set({ message: event.args.message });
});
