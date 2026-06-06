import { ACTIVE, INACTIVE } from '@/constants/user.constant';
import { users } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { BaseActivityLogModel } from './activity.type';
import { BasePackageBenefitModel } from './benefit.type';
import { BaseMemberProfileModel } from './member.type';
import { BasePackageModel } from './package.type';

export type BaseUserModel = InferSelectModel<typeof users>;
export type TUserStatus = typeof ACTIVE | typeof INACTIVE;

export type UserWithRelationships = Omit<BaseUserModel, 'password'> & {
  profile: BaseMemberProfileModel & {
    package: BasePackageModel & {
      benefits: BasePackageBenefitModel[];
    };
  };
  activityLogs: BaseActivityLogModel[];
};
