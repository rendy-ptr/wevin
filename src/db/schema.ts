import { BenefitType, SystemAction } from '@/constants/benefits';
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

export const userRoleEnum = pgEnum('user_role', ['admin', 'member']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive']);
export const benefitTypeEnum = pgEnum('benefit_type', ['toggle', 'quota']);
export const packageStatusEnum = pgEnum('package_status', [
  'active',
  'inactive',
]);

export const PACKAGE_STATUS = {
  ACTIVE: packageStatusEnum.enumValues[0],
  INACTIVE: packageStatusEnum.enumValues[1],
} as const;

export const USER_ROLE_ENUM = {
  ADMIN: userRoleEnum.enumValues[0],
  MEMBER: userRoleEnum.enumValues[1],
} as const;

export const USER_STATUS_ENUM = {
  ACTIVE: {
    LABEL: 'Aktif',
    VALUE: userStatusEnum.enumValues[0],
  },
  INACTIVE: {
    LABEL: 'Tidak Aktif',
    VALUE: userStatusEnum.enumValues[1],
  },
} as const;

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

export type TUserStatusEnum = (typeof userStatusEnum.enumValues)[number];
export type TUser = typeof users.$inferSelect;
export type TMember = typeof memberProfiles.$inferSelect;
export type TBenefitType = typeof benefitTypeEnum.enumValues;
export type TBenefit = typeof benefits.$inferSelect;
export type TPackage = typeof packages.$inferSelect;
export type TPackageStatus = (typeof packageStatusEnum.enumValues)[number];
export type TPackageBenefit = typeof packageBenefits.$inferSelect;
