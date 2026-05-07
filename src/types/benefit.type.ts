import { BenefitType } from '@/constants/benefits';
import { TBenefit } from '@/db/schema';

export type Benefit = TBenefit;

export type BenefitFilterParams = {
  search?: string;
  type?: BenefitType;
  page?: number;
  limit?: number;
};
