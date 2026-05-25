import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import { packageBenefits, packages, packageTemplates } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { BasePackageBenefitModel } from './benefit.type';
import { BaseMemberProfileModel } from './member.type';
import { BasePackageTemplateModel, BaseTemplateModel } from './template.type';
import { BaseUserModel } from './user.type';

export type BasePackageModel = InferSelectModel<typeof packages>;

export type TPackageStatus =
  (typeof PACKAGE_STATUS_VALUES)[keyof typeof PACKAGE_STATUS_VALUES];
export type TPackageBenefitPivot = typeof packageBenefits.$inferSelect;
export type TPackageTemplatePivot = typeof packageTemplates.$inferSelect;

export type PackageWithBenefits = Omit<
  BasePackageModel,
  'createdAt' | 'updatedAt'
> & {
  benefits: BasePackageBenefitModel[];
};

export type PackageFilterParams = {
  search?: string;
  isActive?: boolean;
  isPopular?: boolean;
  page?: number;
  limit?: number;
};

export type PackageWithRelationships = Omit<
  BasePackageModel,
  'createdAt' | 'updatedAt'
> & {
  benefits: Pick<
    BasePackageBenefitModel,
    'id' | 'benefitKey' | 'toggleValue' | 'quotaValue'
  >[];
  templates: (BasePackageTemplateModel & {
    template: Pick<BaseTemplateModel, 'id' | 'name'>;
  })[];
  members: (BaseMemberProfileModel & {
    user: Pick<BaseUserModel, 'id' | 'name'>;
  })[];
};

export type PackageIndexItem = Omit<BasePackageModel, 'updatedAt'> & {
  benefits: Pick<
    BasePackageBenefitModel,
    'id' | 'benefitKey' | 'toggleValue' | 'quotaValue'
  >[];
  templates: (BasePackageTemplateModel & {
    template: Pick<BaseTemplateModel, 'id' | 'name'>;
  })[];
};
