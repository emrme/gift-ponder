import { ponder } from '@/generated';
import { graphql, replaceBigInts } from '@ponder/core';
import { maxUint256 } from 'viem';

const DEFAULT_LIMIT = 20;

const VALID_ORDER_FIELDS = [
  'trending_score',
  'mint_count',
  'message_count',
  'claim_end_timestamp',
] as const;

const VALID_ORDER_DIRECTIONS = ['asc', 'desc'] as const;

ponder.use('/', graphql());
ponder.use('/graphql', graphql());

interface PageInfo {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface GiftRow {
  id: string;
  sender_id: string;
  recipient_id: string;
  is_public: boolean;
  claim_end_timestamp: string;
  token_addresses: string[];
  token_amounts: string[];
  gift_message: string;
  title: string;
  description: string;
  image_uri: string;
  sender_name: string;
  recipient_name: string;
  timestamp: string;
  chain_id: string;
  mint_count: number;
  message_count: number;
  last_mint_timestamp: string;
  recency_factor: string;
  time_left_factor: string;
  trending_score: string;
  total_mints: number;
  total_messages: number;
}

const orderByMap: Record<(typeof VALID_ORDER_FIELDS)[number], keyof GiftRow> = {
  trending_score: 'trending_score',
  mint_count: 'mint_count',
  message_count: 'message_count',
  claim_end_timestamp: 'claim_end_timestamp',
};

ponder.get('/get-trending', async (c) => {
  try {
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));

    const limit = Math.min(Number(c.req.query('limit') || DEFAULT_LIMIT), 100);
    const before = c.req.query('before');
    const after = c.req.query('after');
    const orderBy =
      (c.req.query('orderBy') as (typeof VALID_ORDER_FIELDS)[number]) ||
      'trending_score';
    const orderDirection =
      (c.req.query(
        'orderDirection'
      ) as (typeof VALID_ORDER_DIRECTIONS)[number]) || 'desc';

    const minMintCount = c.req.query('minMintCount');
    const maxMintCount = c.req.query('maxMintCount');
    const isActive = c.req.query('isActive');

    const chainId = c.req.query('chainId');

    if (!VALID_ORDER_FIELDS.includes(orderBy)) {
      return c.json({ error: 'Invalid orderBy parameter' }, 400);
    }
    if (!VALID_ORDER_DIRECTIONS.includes(orderDirection)) {
      return c.json({ error: 'Invalid orderDirection parameter' }, 400);
    }

    const mappedOrderBy = orderByMap[orderBy];

    let whereClause = '';
    const whereConditions: string[] = [];

    if (minMintCount)
      whereConditions.push(`mint_count >= ${Number(minMintCount)}`);
    if (maxMintCount)
      whereConditions.push(`mint_count <= ${Number(maxMintCount)}`);
    if (isActive === 'true') {
      whereConditions.push(
        `claim_end_timestamp::numeric > ${currentTimestamp.toString()}`
      );
    } else if (isActive === 'false') {
      whereConditions.push(
        `claim_end_timestamp::numeric <= ${currentTimestamp.toString()}`
      );
    }

    if (chainId) {
      whereConditions.push(`chain_id = '${chainId}'`);
    }

    if (after) {
      try {
        const decodedCursor = JSON.parse(
          Buffer.from(after, 'base64').toString('utf-8')
        );

        // Validate decodedCursor structure
        if (
          typeof decodedCursor.orderValue === 'undefined' ||
          typeof decodedCursor.id !== 'string'
        ) {
          throw new Error('Invalid cursor structure');
        }

        whereConditions.push(`(
          ${mappedOrderBy} < ${decodedCursor.orderValue} OR
          (${mappedOrderBy} = ${decodedCursor.orderValue} AND id < '${decodedCursor.id}')
        )`);
      } catch (error) {
        console.error('Invalid cursor:', error);
        return c.json({ error: 'Invalid cursor parameter' }, 400);
      }
    }

    if (before) {
      try {
        const decodedCursor = Buffer.from(before, 'base64').toString('utf-8');
        whereConditions.push(`id < '${decodedCursor}'`);
      } catch (error) {
        console.error('Invalid before cursor:', error);
        return c.json({ error: 'Invalid before cursor parameter' }, 400);
      }
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    const result = (
      await c.db.execute(`
      WITH gift_metrics AS (
        SELECT 
          g.id,
          g.sender_id,
          g.recipient_id,
          g.is_public,
          g.claim_end_timestamp,
          g.token_addresses,
          g.token_amounts,
          g.gift_message,
          g.title,
          g.description,
          g.image_uri,
          g.sender_name,
          g.recipient_name,
          g.timestamp,
          g.chain_id,
          g.mint_count,
          g.message_count,
          g.last_mint_timestamp,
          COUNT(m.id) as total_mints,
          COUNT(CASE WHEN m.message IS NOT NULL AND TRIM(m.message) != '' THEN 1 END) as total_messages
        FROM gift g
        LEFT JOIN mint m ON g.id = m.gift_id
        GROUP BY 
          g.id,
          g.sender_id,
          g.recipient_id,
          g.is_public,
          g.claim_end_timestamp,
          g.token_addresses,
          g.token_amounts,
          g.gift_message,
          g.title,
          g.description,
          g.image_uri,
          g.sender_name,
          g.recipient_name,
          g.timestamp,
          g.chain_id,
          g.mint_count,
          g.message_count,
          g.last_mint_timestamp
      ), scored_gifts AS (
        SELECT 
          gm.*,
          POWER(1.0 / (EXTRACT(EPOCH FROM (NOW() - to_timestamp(${Number(
            currentTimestamp
          )}))) / (7 * 24 * 3600) + 1), 0.7) as recency_factor,
          CASE 
            WHEN gm.claim_end_timestamp = ${maxUint256.toString()}::numeric THEN 1
            ELSE POWER(GREATEST(0, (gm.claim_end_timestamp::numeric - ${Number(
              currentTimestamp
            )})::numeric) / (24 * 60 * 60) + 1, 0.5)
          END as time_left_factor,
          (
            POWER(COALESCE(gm.total_mints, 0) + 1, 0.8) * 45 +
            POWER(COALESCE(gm.total_messages, 0) + 1, 0.7) * 30 +
            CASE 
              WHEN gm.claim_end_timestamp = ${maxUint256.toString()}::numeric THEN 15
              ELSE POWER(GREATEST(0, (gm.claim_end_timestamp::numeric - ${Number(
                currentTimestamp
              )})::numeric) / (24 * 60 * 60) + 1, 0.5) * 15
            END +
            POWER(1.0 / (EXTRACT(EPOCH FROM (NOW() - to_timestamp(${Number(
              currentTimestamp
            )}))) / (7 * 24 * 3600) + 1), 0.7) * 10
          ) as trending_score
        FROM gift_metrics gm
      )
      SELECT 
        g.*
      FROM scored_gifts g
      ${whereClause}
      ORDER BY ${mappedOrderBy} ${
        orderDirection === 'desc' ? 'DESC' : 'ASC'
      }, id ${orderDirection === 'desc' ? 'DESC' : 'ASC'}
      LIMIT ${limit + 1}
    `)
    ).rows;

    const formattedResult = result.map((gift: GiftRow) => ({
      ...gift,
      cursor: Buffer.from(
        JSON.stringify({
          orderValue: gift[mappedOrderBy as keyof GiftRow],
          id: gift.id,
        })
      ).toString('base64'),
    }));

    const hasNextPage = formattedResult.length > limit;

    const items = formattedResult.slice(0, limit).map((gift: GiftRow) => ({
      id: gift.id,
      senderId: gift.sender_id,
      recipientId: gift.recipient_id,
      isPublic: gift.is_public,
      claimEndTimestamp: gift.claim_end_timestamp,
      tokenAddresses: gift.token_addresses,
      tokenAmounts: gift.token_amounts,
      giftMessage: gift.gift_message,
      title: gift.title,
      description: gift.description,
      imageUri: gift.image_uri,
      senderName: gift.sender_name,
      recipientName: gift.recipient_name,
      timestamp: gift.timestamp?.toString() || '0',
      chainId: gift.chain_id,
      mintCount: Number(gift.total_mints || 0),
      messageCount: Number(gift.total_messages || 0),
      lastMintTimestamp: gift.last_mint_timestamp,
      trendingScore: Number(gift.trending_score || 0),
      sender: {
        id: gift.sender_id,
      },
      recipient: {
        id: gift.recipient_id,
      },
    }));

    return c.json({
      data: {
        gifts: replaceBigInts(
          items.map(
            ({ cursor, ...rest }: { cursor?: string; [key: string]: any }) =>
              rest
          ),
          (v) => String(v)
        ),
        pageInfo: {
          startCursor: items.length > 0 ? formattedResult[0].cursor : null,
          endCursor:
            items.length > 0
              ? formattedResult[formattedResult.length - 1].cursor
              : null,
          hasNextPage,
          hasPreviousPage: after != null,
        },
      },
    });
  } catch (error) {
    console.error('Error in get-trending:', error);
    return c.json(
      {
        data: null,
        error: 'An error occurred while processing the request',
      },
      500
    );
  }
});
