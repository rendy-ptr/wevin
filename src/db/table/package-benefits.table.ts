import { BenefitKeyType } from '@/types/benefit.type';
import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { packages } from './packages.table';

export const packageBenefits = pgTable('package_benefits', {
  id: uuid('id').primaryKey().defaultRandom(),
  packageId: integer('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  benefitKey: varchar('benefit_key', { length: 50 })
    .notNull()
    .$type<BenefitKeyType>(),
  toggleValue: boolean('toggle_value'),
  quotaValue: integer('quota_value'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const packageBenefitRelations = relations(
  packageBenefits,
  ({ one }) => ({
    package: one(packages, {
      fields: [packageBenefits.packageId],
      references: [packages.id],
    }),
  }),
);
