import { TPackage } from '@/db/schema';

export type Package = TPackage;

export type PackageFilterParams = {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
};
