import { QuotaBenefitKeyType } from '@/types/benefit.type';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { packages } from './packages.table';

export const packageQuotas = pgTable('package_quotas', {
  id: uuid('id').primaryKey().defaultRandom(),
  packageId: integer('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  quotaKey: varchar('quota_key', { length: 50 })
    .notNull()
    .$type<QuotaBenefitKeyType>(),
  value: integer('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const packageQuotaRelations = relations(packageQuotas, ({ one }) => ({
  package: one(packages, {
    fields: [packageQuotas.packageId],
    references: [packages.id],
  }),
}));
