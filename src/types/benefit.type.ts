import { BENEFIT_TYPE_VALUES, benefits } from '@/db/schema';

export type TBenefit = typeof benefits.$inferSelect;
export type TBenefitType =
  (typeof BENEFIT_TYPE_VALUES)[keyof typeof BENEFIT_TYPE_VALUES];

export type BenefitFilterParams = {
  search?: string;
  type?: TBenefitType;
  page?: number;
  limit?: number;
};
