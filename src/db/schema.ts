import {
  boolean,
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

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').notNull().default('member'),
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
  phone: varchar('phone', { length: 20 }),
  status: userStatusEnum('status').notNull().default('active'),
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
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const benefits = pgTable('benefits', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  type: benefitTypeEnum('type').notNull().default('toggle'),
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
