import { ponder } from '@/generated';
import { graphql, replaceBigInts } from '@ponder/core';
import { maxUint256 } from 'viem';

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

ponder.use('/', graphql());
ponder.use('/graphql', graphql());

ponder.get('/get-trending', async (c) => {
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));

  const limit = Number(c.req.query('limit') || DEFAULT_LIMIT);
  const page = Number(c.req.query('page') || DEFAULT_PAGE);
  const orderBy = c.req.query('orderBy') || 'trendingScore';
  const orderDirection = c.req.query('orderDirection') || 'desc';
  const offset = (page - 1) * limit;

  const giftsWithMints = await c.db.query.gift.findMany({
    with: {
      mints: true,
    },
  });

  const giftsWithScores = giftsWithMints.map((gift) => {
    const timeDiff = Number(currentTimestamp - gift.timestamp);
    const recencyFactor = Math.pow(1 / (timeDiff / (7 * 24 * 3600) + 1), 0.7);

    const isInfinite = gift.claimEndTimestamp === maxUint256;
    let timeLeftFactor = 1;
    if (!isInfinite) {
      const timeLeft = Math.max(
        0,
        Number(gift.claimEndTimestamp - currentTimestamp)
      );
      timeLeftFactor = Math.pow(timeLeft / (24 * 60 * 60) + 1, 0.5);
    }

    const mintCountFactor = Math.pow(gift.mints.length + 1, 0.8);
    const messageCount = gift.mints.filter(
      (mint) => mint.message && mint.message.trim() !== ''
    ).length;
    const messageCountFactor = Math.pow(messageCount + 1, 0.7);

    const score =
      mintCountFactor * 45 +
      messageCountFactor * 30 +
      timeLeftFactor * 15 +
      recencyFactor * 10;

    return {
      ...gift,
      trendingScore: score,
    };
  });

  const sortedGifts = giftsWithScores.sort((a, b) => {
    const aValue = a[orderBy as keyof typeof a];
    const bValue = b[orderBy as keyof typeof b];
    const modifier = orderDirection === 'desc' ? -1 : 1;

    return (Number(aValue) - Number(bValue)) * modifier;
  });

  const paginatedGifts = sortedGifts.slice(offset, offset + limit);
  const hasMore = offset + limit < sortedGifts.length;

  return c.json(
    replaceBigInts(
      {
        items: paginatedGifts,
        nextPage: hasMore ? page + 1 : null,
        total: sortedGifts.length,
      },
      (v) => String(v)
    )
  );
});
