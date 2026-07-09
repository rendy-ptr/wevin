import type { QuotaBenefitKeyType } from '@/types/benefit.type';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { memberProfiles } from './member-profiles.table';

export const memberQuotaUsage = pgTable(
  'member_quota_usage',
  {
    id: serial('id').primaryKey(),
    memberId: integer('member_id')
      .notNull()
      .references(() => memberProfiles.id, { onDelete: 'cascade' }),
    benefitKey: varchar('benefit_key', { length: 50 })
      .notNull()
      .$type<QuotaBenefitKeyType>(),
    usedValue: integer('used_value').notNull().default(0),
    resetAt: timestamp('reset_at'),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique().on(t.memberId, t.benefitKey)],
);

export const memberQuotaUsageRelations = relations(
  memberQuotaUsage,
  ({ one }) => ({
    memberProfile: one(memberProfiles, {
      fields: [memberQuotaUsage.memberId],
      references: [memberProfiles.id],
    }),
  }),
);
