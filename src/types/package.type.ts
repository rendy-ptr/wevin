import { PACKAGE_STATUS_VALUES, packageBenefits, packages } from '@/db/schema';
import { TBenefit } from './benefit.type';

export type TPackageStatus =
  (typeof PACKAGE_STATUS_VALUES)[keyof typeof PACKAGE_STATUS_VALUES];
export type TPackageBenefitPivot = typeof packageBenefits.$inferSelect;

export type TPackage = typeof packages.$inferSelect;

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
