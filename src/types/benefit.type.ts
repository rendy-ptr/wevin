import { BENEFITS_DATA } from '@/constants/benefit.constant';
import { packageBenefits } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type BenefitType = 'toggle' | 'quota';

export type BenefitKeyType = (typeof BENEFITS_DATA)[number]['key'];
export type ToggleBenefitKeyType = Extract<
  (typeof BENEFITS_DATA)[number],
  { type: 'toggle' }
>['key'];
export type QuotaBenefitKeyType = Extract<
  (typeof BENEFITS_DATA)[number],
  { type: 'quota' }
>['key'];

export type BenefitFilterParams = {
  search?: string;
  type?: BenefitType;
  page?: number;
  limit?: number;
};

export type BasePackageBenefitModel = InferSelectModel<typeof packageBenefits>;
