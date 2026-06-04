import { BenefitKeyType } from '@/types/benefit.type';
import { SessionPackage } from '@/types/session.type';

export function createPermission(pkg: SessionPackage | null) {
  if (!pkg) {
    return {
      can: (_key: BenefitKeyType) => false,
      getQuota: (_key: BenefitKeyType) => 0,
      isUnlimited: (_key: BenefitKeyType) => false,
      canAdd: (_key: BenefitKeyType, _used: number) => false,
      hasTemplate: (_templateId: number) => false,
    };
  }

  const benefitMap = new Map(pkg.benefits.map((b) => [b.benefitKey, b]));

  return {
    can(key: BenefitKeyType): boolean {
      return benefitMap.get(key)?.toggleValue === true;
    },

    getQuota(key: BenefitKeyType): number {
      return benefitMap.get(key)?.quotaValue ?? 0;
    },

    isUnlimited(key: BenefitKeyType): boolean {
      return benefitMap.get(key)?.quotaValue === -1;
    },

    canAdd(key: BenefitKeyType, used: number): boolean {
      const quota = benefitMap.get(key)?.quotaValue;
      if (quota === undefined) return false;
      if (quota === -1) return true;
      return used < (quota ?? 0);
    },

    hasTemplate(templateId: number): boolean {
      return pkg.templateIds.includes(templateId);
    },
  };
}
