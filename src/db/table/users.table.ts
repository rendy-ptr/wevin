import { ADMIN, MEMBER } from '@/constants/role';
import { ACTIVE, INACTIVE } from '@/constants/user.constant';
import { relations } from 'drizzle-orm';
import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { activityLogs } from './activity-log.table';
import { memberProfiles } from './member-profiles.table';

export const userRoleEnum = pgEnum('user_role', [ADMIN, MEMBER]);

export const userStatusEnum = pgEnum('user_status', [ACTIVE, INACTIVE]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('member'),
  status: userStatusEnum('status').notNull().default('active'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  memberProfile: one(memberProfiles, {
    fields: [users.id],
    references: [memberProfiles.userId],
  }),
  activityLogs: many(activityLogs),
}));
