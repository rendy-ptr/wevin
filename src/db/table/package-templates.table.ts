import { relations } from 'drizzle-orm';
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { packages } from './packages.table';
import { templates } from './template.table';

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
