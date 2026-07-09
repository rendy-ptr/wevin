import { ADMIN, MEMBER } from '@/constants/role';
import { BenefitKeyType } from './benefit.type';

export type SessionBenefit = {
  benefitKey: BenefitKeyType;
  toggleValue: boolean | null;
  quotaValue: number | null;
};

export type SessionPackage = {
  id: number;
  name: string;
  benefits: SessionBenefit[];
  templateIds: number[];
};

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: typeof ADMIN | typeof MEMBER;
  createdAt: Date;
  package: SessionPackage | null;
};
