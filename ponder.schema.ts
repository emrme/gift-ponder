import { onchainTable, relations, primaryKey } from '@ponder/core';

export const user = onchainTable('user', (t) => ({
  id: t.hex().primaryKey(),
  address: t.hex().notNull(),
  smartAccountAddress: t.hex(),
}));

export const userRelations = relations(user, ({ many }) => ({
  sentGifts: many(gift, { relationName: 'sender' }),
  receivedGifts: many(gift, { relationName: 'recipient' }),
  mintedGifts: many(gift, { relationName: 'mintRecipient' }),
}));

export const gift = onchainTable('gift', (t) => ({
  id: t.hex().primaryKey(),
  senderId: t.hex().notNull(),
  recipientId: t.hex().notNull(),
  isPublic: t.boolean().notNull(),
  claimEndTimestamp: t.bigint().notNull(),
  tokenAddresses: t.hex().array(),
  tokenAmounts: t.bigint().array(),
  giftMessage: t.text().notNull(),
  title: t.text().notNull(),
  description: t.text().notNull(),
  imageUri: t.text().notNull(),
  senderName: t.text().notNull(),
  recipientName: t.text().notNull(),
  timestamp: t.bigint().notNull(),
  chainId: t.bigint().notNull(),
  mintCount: t.integer().notNull().default(0),
  messageCount: t.integer().notNull().default(0),
  lastMintTimestamp: t.bigint().notNull(),
}));

export const giftRelations = relations(gift, ({ one, many }) => ({
  sender: one(user, {
    fields: [gift.senderId],
    references: [user.id],
    relationName: 'sender',
  }),
  recipient: one(user, {
    fields: [gift.recipientId],
    references: [user.id],
    relationName: 'recipient',
  }),
  mints: many(mint),
}));

export const mint = onchainTable('mint', (t) => ({
  id: t.text().primaryKey(),
  giftId: t.hex().notNull(),
  claimConditionIndex: t.bigint().notNull(),
  claimerId: t.hex().notNull(),
  senderId: t.hex().notNull(),
  recipientId: t.hex().notNull(),
  claimEndTimestamp: t.bigint(),
  senderName: t.text().notNull(),
  recipientName: t.text().notNull(),
  startTokenId: t.bigint().notNull(),
  quantityClaimed: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
  chainId: t.bigint().notNull(),
  message: t.text().notNull(),
  title: t.text().notNull(),
  description: t.text().notNull(),
  imageUri: t.text().notNull(),
}));

export const mintRelations = relations(mint, ({ one }) => ({
  gift: one(gift, { fields: [mint.giftId], references: [gift.id] }),
  claimer: one(user, { fields: [mint.claimerId], references: [user.id] }),
  sender: one(user, { fields: [mint.senderId], references: [user.id] }),
  recipient: one(user, {
    fields: [mint.recipientId],
    references: [user.id],
  }),
}));
