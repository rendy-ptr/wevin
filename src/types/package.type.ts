import { PACKAGE_STATUS_VALUES } from '@/constants/package.constant';
import { packageBenefits, packages, packageTemplates } from '@/db/schema';
import { TBenefit } from './benefit.type';

export type TPackageStatus =
  (typeof PACKAGE_STATUS_VALUES)[keyof typeof PACKAGE_STATUS_VALUES];
export type TPackageBenefitPivot = typeof packageBenefits.$inferSelect;
export type TPackageTemplatePivot = typeof packageTemplates.$inferSelect;

export type TPackage = typeof packages.$inferSelect & {
  benefits?: TPackageBenefitPivot[];
  templates?: TPackageTemplatePivot[];
};

export type TPackageWithBenefits = TPackage & {
  benefits: (TPackageBenefitPivot & {
    benefit: TBenefit;
  })[];
};

export type PackageFilterParams = {
  search?: string;
  status?: TPackageStatus;
  page?: number;
  limit?: number;
};
