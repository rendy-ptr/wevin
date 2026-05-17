import { BENEFIT_TYPE, SystemAction } from '@/constants/benefit.constant';
import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import {
  USER_ROLE_VALUES,
  USER_STATUS_VALUES,
} from '@/constants/user.constant';
import { TBenefitType as BenefitType } from '@/types/benefit.type';
import { InferSelectModel, relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  USER_ROLE_VALUES.ADMIN,
  USER_ROLE_VALUES.MEMBER,
]);
export const userStatusEnum = pgEnum('user_status', [
  USER_STATUS_VALUES.ACTIVE,
  USER_STATUS_VALUES.INACTIVE,
]);
export const benefitTypeEnum = pgEnum('benefit_type', [
  BENEFIT_TYPE.TOGGLE,
  BENEFIT_TYPE.QUOTA,
]);
export const packageStatusEnum = pgEnum('package_status', [
  PACKAGE_STATUS_VALUES.ACTIVE,
  PACKAGE_STATUS_VALUES.INACTIVE,
]);

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
  status: packageStatusEnum('status')
    .notNull()
    .default(PACKAGE_STATUS_VALUES.ACTIVE),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const benefits = pgTable('benefits', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique().$type<SystemAction>(),
  type: benefitTypeEnum('type')
    .notNull()
    .default(BENEFIT_TYPE.TOGGLE)
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
    value: jsonb('value').notNull(),
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

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  thumbnail: text('thumbnail'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const packageTemplates = pgTable(
  'package_templates',
  {
    id: serial('id').primaryKey(),
    packageId: integer('package_id')
      .notNull()
      .references(() => packages.id, { onDelete: 'cascade' }),
    templateId: integer('template_id')
      .notNull()
      .references(() => templates.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    packageIdx: index('pt_package_idx').on(table.packageId),
    templateIdx: index('pt_template_idx').on(table.templateId),
    uniquePackageTemplate: uniqueIndex('pt_unique_idx').on(
      table.packageId,
      table.templateId,
    ),
  }),
);

export const packageRelations = relations(packages, ({ many }) => ({
  benefits: many(packageBenefits),
  templates: many(packageTemplates),
  members: many(memberProfiles),
}));

export const benefitRelations = relations(benefits, ({ many }) => ({
  packages: many(packageBenefits),
}));

export const templateRelations = relations(templates, ({ many }) => ({
  packages: many(packageTemplates),
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

export const packageTemplateRelations = relations(
  packageTemplates,
  ({ one }) => ({
    package: one(packages, {
      fields: [packageTemplates.packageId],
      references: [packages.id],
    }),
    template: one(templates, {
      fields: [packageTemplates.templateId],
      references: [templates.id],
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

export type TPackageTemplate = InferSelectModel<typeof packageTemplates>;
