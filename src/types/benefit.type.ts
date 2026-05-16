import { BENEFIT_TYPE } from '@/constants/benefit.constant';
import { benefits } from '@/db/schema';

export type TBenefit = typeof benefits.$inferSelect;
export type TBenefitType = (typeof BENEFIT_TYPE)[keyof typeof BENEFIT_TYPE];
export type BenefitValue = boolean | number | null;

export type BenefitFilterParams = {
  search?: string;
  type?: TBenefitType;
  page?: number;
  limit?: number;
};
