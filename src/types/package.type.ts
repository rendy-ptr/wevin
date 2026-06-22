import {
  packageBenefits,
  packageQuotas,
  packages,
  packageTemplates,
} from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { BenefitKeyType } from './benefit.type';
import { BaseMemberProfileModel } from './member.type';
import { BasePackageTemplateModel, BaseTemplateModel } from './template.type';
import { BaseUserModel } from './user.type';

export type BasePackageModel = InferSelectModel<typeof packages>;

export type TPackageBenefitPivot = typeof packageBenefits.$inferSelect;
export type TPackageQuotaPivot = typeof packageQuotas.$inferSelect;
export type TPackageTemplatePivot = typeof packageTemplates.$inferSelect;

export type PackageFilterParams = {
  search?: string;
  isActive?: boolean;
  isPopular?: boolean;
  page?: number;
  limit?: number;
};

// ----------------------------------------------------
// Sub-types / Relationship Details
// ----------------------------------------------------

export type PackageBenefitDetail = {
  id: string;
  benefitKey: BenefitKeyType;
  toggleValue: boolean | null;
  quotaValue: number | null;
};

export type PackageTemplateDetail = BasePackageTemplateModel & {
  template: Pick<BaseTemplateModel, 'id' | 'name'>;
};

export type PackageMemberDetail = BaseMemberProfileModel & {
  user: Pick<BaseUserModel, 'id' | 'name'>;
};

// ----------------------------------------------------
// Composite / Main Package Types
// ----------------------------------------------------

export type PackageWithBenefits = Omit<
  BasePackageModel,
  'createdAt' | 'updatedAt'
> & {
  benefits: PackageBenefitDetail[];
};

export type PackageWithRelationships = Omit<
  BasePackageModel,
  'createdAt' | 'updatedAt'
> & {
  benefits: PackageBenefitDetail[];
  templates: PackageTemplateDetail[];
  members: PackageMemberDetail[];
};

export type PackageIndexItem = Omit<BasePackageModel, 'updatedAt'> & {
  benefits: PackageBenefitDetail[];
  templates: PackageTemplateDetail[];
};

export type ActivePackageWithBenefits = Pick<
  BasePackageModel,
  'id' | 'name' | 'price'
> & {
  benefits: PackageBenefitDetail[];
  templates: PackageTemplateDetail[];
};
