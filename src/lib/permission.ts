import { SystemAction } from '@/constants/benefit.constant';

type PackageBenefitWithKey = {
  value: string;
  benefit: {
    key: string;
    type: string;
  };
};

type UserWithPackage = {
  memberProfile: {
    package: {
      benefits: PackageBenefitWithKey[];
    };
  } | null;
};

export function getBenefit(
  user: UserWithPackage,
  action: SystemAction,
): string | null {
  const benefits = user.memberProfile?.package?.benefits ?? [];
  const found = benefits.find((b) => b.benefit.key === action);
  return found?.value ?? null;
}

export function can(user: UserWithPackage, action: SystemAction): boolean {
  const val = getBenefit(user, action);
  return val === 'true';
}

export function limit(user: UserWithPackage, action: SystemAction): number {
  const val = getBenefit(user, action);
  if (!val) return 0;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
}
