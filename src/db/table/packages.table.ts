import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import { BenefitType } from '@/types/benefit.type';
import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { memberProfiles } from './member-profiles.table';
import { packageBenefits } from './package-benefits.table';
import { packageTemplates } from './package-templates.table';

export const benefitTypeEnum = pgEnum('benefit_type', ['toggle', 'quota'] as [
  BenefitType,
  ...BenefitType[],
]);

export const packageStatusEnum = pgEnum('package_status', [
  PACKAGE_STATUS_VALUES.ACTIVE,
  PACKAGE_STATUS_VALUES.INACTIVE,
]);

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  price: integer('price').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  isPopular: boolean('is_popular').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const packageRelations = relations(packages, ({ many }) => ({
  benefits: many(packageBenefits),
  templates: many(packageTemplates),
  members: many(memberProfiles),
}));
