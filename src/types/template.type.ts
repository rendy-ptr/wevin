import { packageTemplates, templates } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type BaseTemplateModel = InferSelectModel<typeof templates>;

export type BasePackageTemplateModel = InferSelectModel<
  typeof packageTemplates
>;

export type TTemplate = typeof templates.$inferSelect;
