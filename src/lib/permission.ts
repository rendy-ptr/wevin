import { SystemAction } from '@/constants/benefit.constant';
import { BenefitValue } from '@/types/benefit.type';

export interface UserWithPermissions {
  profile?: {
    package?: {
      benefits?: Array<{
        value: BenefitValue;
        benefit: {
          key: string;
        };
      }>;
    } | null;
  } | null;
}

export function getBenefit(
  user: UserWithPermissions | null | undefined,
  action: SystemAction,
): BenefitValue {
  if (!user) return null;
  const benefits = user.profile?.package?.benefits ?? [];
  const found = benefits.find((b) => b.benefit.key === action);
  return found?.value ?? null;
}

export function can(
  user: UserWithPermissions | null | undefined,
  action: SystemAction,
): boolean {
  const val = getBenefit(user, action);
  return val === true;
}

export function limit(
  user: UserWithPermissions | null | undefined,
  action: SystemAction,
): number {
  const val = getBenefit(user, action);
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? 0 : parsed;
}
