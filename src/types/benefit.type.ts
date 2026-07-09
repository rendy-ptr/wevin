import {
  QUOTA_BENEFITS_DATA,
  TOGGLE_BENEFITS_DATA,
} from '@/constants/benefit.constant';
import { packageBenefits, packageQuotas } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type BenefitType = 'toggle' | 'quota';

export type ToggleBenefitKeyType = (typeof TOGGLE_BENEFITS_DATA)[number]['key'];
export type QuotaBenefitKeyType = (typeof QUOTA_BENEFITS_DATA)[number]['key'];
export type BenefitKeyType = ToggleBenefitKeyType | QuotaBenefitKeyType;

export type BenefitFilterParams = {
  search?: string;
  type?: BenefitType;
  page?: number;
  limit?: number;
};

export type BasePackageBenefitModel = InferSelectModel<typeof packageBenefits>;
export type BasePackageQuotaModel = InferSelectModel<typeof packageQuotas>;
