import { BenefitType, SystemAction } from '@/constants/benefit.constant';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const USER_ROLE_VALUES = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const USER_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const BENEFIT_TYPE_VALUES = {
  TOGGLE: 'toggle',
  QUOTA: 'quota',
} as const;

export const PACKAGE_STATUS_VALUES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const userRoleEnum = pgEnum('user_role', [
  USER_ROLE_VALUES.ADMIN,
  USER_ROLE_VALUES.MEMBER,
]);
export const userStatusEnum = pgEnum('user_status', [
  USER_STATUS_VALUES.ACTIVE,
  USER_STATUS_VALUES.INACTIVE,
]);
export const benefitTypeEnum = pgEnum('benefit_type', [
  BENEFIT_TYPE_VALUES.TOGGLE,
  BENEFIT_TYPE_VALUES.QUOTA,
]);
export const packageStatusEnum = pgEnum('package_status', [
  PACKAGE_STATUS_VALUES.ACTIVE,
  PACKAGE_STATUS_VALUES.INACTIVE,
]);

import { PACKAGE_STATUS } from '@/constants/package.constant';

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

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  price: integer('price').notNull().default(0),
  status: packageStatusEnum('status').notNull().default(PACKAGE_STATUS.ACTIVE),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const benefits = pgTable('benefits', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique().$type<SystemAction>(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  type: benefitTypeEnum('type')
    .notNull()
    .default('toggle')
    .$type<BenefitType>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const packageBenefits = pgTable(
  'package_benefits',
  {
    id: serial('id').primaryKey(),
    packageId: integer('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    benefitId: integer('benefit_id')
      .notNull()
      .references(() => benefits.id, { onDelete: 'cascade' }),
    value: text('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    packageIdx: index('pb_package_idx').on(table.packageId),
    benefitIdx: index('pb_benefit_idx').on(table.benefitId),
    uniquePackageBenefit: uniqueIndex('pb_unique_idx').on(
      table.packageId,
      table.benefitId,
    ),
  }),
);

import { relations } from 'drizzle-orm';

export const packageRelations = relations(packages, ({ many }) => ({
  benefits: many(packageBenefits),
  members: many(memberProfiles),
}));

export const benefitRelations = relations(benefits, ({ many }) => ({
  packages: many(packageBenefits),
}));

export const packageBenefitRelations = relations(
  packageBenefits,
  ({ one }) => ({
    package: one(packages, {
      fields: [packageBenefits.packageId],
      references: [packages.id],
    }),
    benefit: one(benefits, {
      fields: [packageBenefits.benefitId],
      references: [benefits.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(memberProfiles, {
    fields: [users.id],
    references: [memberProfiles.userId],
  }),
}));

export const memberProfileRelations = relations(memberProfiles, ({ one }) => ({
  user: one(users, {
    fields: [memberProfiles.userId],
    references: [users.id],
  }),
  package: one(packages, {
    fields: [memberProfiles.packageId],
    references: [packages.id],
  }),
}));
