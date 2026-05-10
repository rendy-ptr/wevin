import { TPackage, TPackageStatus } from '@/db/schema';

export type Package = TPackage;

export type PackageFilterParams = {
  search?: string;
  status?: TPackageStatus;
  page?: number;
  limit?: number;
};
