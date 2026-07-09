import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { invitations } from './invitation/invitations.table';
import { memberQuotaUsage } from './member-quota-usage.table';
import { packages } from './packages.table';
import { users } from './users.table';

export const memberProfiles = pgTable('member_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  packageId: integer('package_id')
    .notNull()
    .references(() => packages.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const memberProfileRelations = relations(
  memberProfiles,
  ({ one, many }) => ({
    user: one(users, {
      fields: [memberProfiles.userId],
      references: [users.id],
    }),
    package: one(packages, {
      fields: [memberProfiles.packageId],
      references: [packages.id],
    }),
    invitations: many(invitations),
    quotaUsages: many(memberQuotaUsage),
  }),
);
